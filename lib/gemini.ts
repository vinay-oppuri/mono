import "server-only"

type GeminiMessage = {
    role: "user" | "assistant"
    content: string
}

export class GeminiRequestError extends Error {
    status: number
    retryAfterSeconds?: number

    constructor(message: string, status: number, retryAfterSeconds?: number) {
        super(message)
        this.name = "GeminiRequestError"
        this.status = status
        this.retryAfterSeconds = retryAfterSeconds
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateAgentReply({
    agentName,
    instructions,
    messages
}: {
    agentName: string
    instructions: string
    messages: GeminiMessage[]
}) {
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured")
    }

    const conversation = messages
        .slice(-20)
        .map((message) => `${message.role === "assistant" ? agentName : "User"}: ${message.content}`)
        .join("\n\n")

    const prompt = `
You are ${agentName}, an AI agent in a direct chat app.

Follow these agent instructions:
${instructions}

Reply to the user's latest message using the conversation context below.
Be helpful, clear, and natural. If the user asks for code or structured output, format it cleanly.

Conversation:
${conversation}
    `.trim()

    const body = JSON.stringify({
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
        }
    })

    let response: Response | undefined

    for (let attempt = 0; attempt < 3; attempt++) {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            }
        )

        if (response.ok || response.status !== 429 || attempt === 2) {
            break
        }

        const retryAfter = Number(response.headers.get("retry-after"))
        const backoffMs = Number.isFinite(retryAfter)
            ? retryAfter * 1000
            : 1000 * 2 ** attempt

        await sleep(backoffMs)
    }

    if (!response) {
        throw new Error("Gemini request failed before a response was returned")
    }

    if (!response.ok) {
        const retryAfter = Number(response.headers.get("retry-after"))
        const errorBody = await response.json().catch(() => null)
        const apiMessage = errorBody?.error?.message
        const message = response.status === 429
            ? "Gemini is rate-limited or out of quota for this API key. Try again later, check billing/quota, or set GEMINI_MODEL to another available Gemini model."
            : apiMessage || `Gemini request failed with status ${response.status}`

        throw new GeminiRequestError(
            message,
            response.status,
            Number.isFinite(retryAfter) ? retryAfter : undefined
        )
    }

    const result = await response.json()
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text || typeof text !== "string") {
        throw new Error("Gemini did not return a text response")
    }

    return text.trim()
}
