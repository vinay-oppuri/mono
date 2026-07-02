"use client"

import { useEffect, useRef, useState } from "react"

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Sparkles, RefreshCw, Clipboard, Check } from "lucide-react"
import Markdown from "react-markdown"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/error-state"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { LoadingState } from "@/components/loading-state"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { ChatIdViewHeader } from "../components/chat-id-view-header"
import { motion } from "framer-motion"
import { ChatInput } from "@/components/chat-input"
import { useSession } from "@/lib/auth-client"
import {
    Message,
    MessageAvatar,
    MessageContent,
    MessageHeader,
    MessageGroup
} from "@/components/ui/message"

interface Props {
    chatId: string
}

// Custom code component with syntax window and copy capabilities
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            toast.success("Code snippet copied")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Failed to copy snippet")
        }
    }

    return (
        <div className="my-4 rounded-xl border border-white/[0.08] bg-[#090b0e] overflow-hidden font-mono text-sm shadow-lg select-text">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#11141b] text-xs text-[#8892b0] select-none">
                <span className="uppercase font-semibold tracking-wider text-[10px] text-[#8892b0]/70">{language}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/[0.05] hover:text-white transition-all font-semibold cursor-pointer text-[#8892b0]"
                >
                    {copied ? (
                        <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Clipboard className="size-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto scrollbar-none leading-relaxed text-[#d0d6e2] bg-[#090b0e] select-text">
                <code>{code}</code>
            </pre>
        </div>
    )
}

// Reusable Copy button for message bubbles
const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success("Message copied")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Failed to copy message")
        }
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="size-7 rounded-lg hover:bg-white/[0.05] hover:text-white transition-all text-muted-foreground cursor-pointer shrink-0"
        >
            {copied ? (
                <Check className="size-3.5 text-emerald-400" />
            ) : (
                <Clipboard className="size-3.5" />
            )}
        </Button>
    )
}

export const ChatIdView = ({ chatId }: Props) => {
    const [message, setMessage] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    const [selectedInputAgent, setSelectedInputAgent] = useState<{ id: string; name: string } | null>(null)

    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const { data: session } = useSession()

    // Get current chat details
    const { data } = useSuspenseQuery(trpc.chats.getOne.queryOptions({ id: chatId }))

    // Fetch custom agents list
    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100
        })
    )
    const agentsList = agents.data?.items.map((a) => ({ id: a.id, name: a.name })) || []

    // Initialize selectedInputAgent once data is loaded
    useEffect(() => {
        if (data.agent) {
            setSelectedInputAgent({ id: data.agent.id, name: data.agent.name })
        } else {
            setSelectedInputAgent(null)
        }
    }, [data.agent])

    // Mutations
    const sendMessage = useMutation(
        trpc.chats.sendMessage.mutationOptions({
            onSuccess: async () => {
                setMessage("")
                await queryClient.invalidateQueries(trpc.chats.getOne.queryOptions({ id: chatId }))
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    // Auto-scroll on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data.messages.length, sendMessage.isPending])

    const handleSend = () => {
        const content = message.trim()
        if (!content || sendMessage.isPending) return
        sendMessage.mutate({ chatId, content, agentId: selectedInputAgent?.id || null })
    }

    return (
        <>
            <div className="flex-1 px-4 md:px-8 flex flex-col bg-background text-foreground min-h-0 relative select-none">
                <ChatIdViewHeader
                    chatId={chatId}
                    chatTitle={data.title}
                />

                {/* ── Scrollable Chat Messages Container ── */}
                <div className="flex-1 overflow-y-auto scrollbar-none pb-40 space-y-6 pt-2 select-text">
                    
                    {data.messages.length === 0 && (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-y-4 px-4">
                            <div className="relative">
                                <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-16 border border-white/[0.06] rounded-full shadow-lg" />
                                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Sparkles className="size-2.5 text-primary animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Chat with {data.agent?.name || "Gemini Assistant"}</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
                                    {data.agent?.instructions || "Ask anything. I am a helpful AI assistant."}
                                </p>
                            </div>
                        </div>
                    )}

                    <MessageGroup className="max-w-3xl mx-auto space-y-6">
                        {data.messages.map((item) => {
                            const isUser = item.role === "user"

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <Message align={isUser ? "end" : "start"}>
                                        <MessageAvatar className="self-start">
                                            <GeneratedAvatar
                                                seed={isUser ? (session?.user?.name || "User") : (item.agent?.name || data.agent?.name || "Gemini")}
                                                variant={isUser ? "initials" : "botttsNeutral"}
                                                className="size-8 border border-white/[0.06] rounded-full"
                                            />
                                        </MessageAvatar>
                                        <MessageContent>
                                            <MessageHeader>
                                                <span className="font-semibold text-foreground">
                                                    {isUser ? "You" : (item.agent?.name || data.agent?.name || "Gemini Assistant")}
                                                </span>
                                                <span className="ml-2 text-[10px] text-muted-foreground opacity-60">
                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </MessageHeader>
                                            <div
                                                data-slot="message-bubble"
                                                className={cn(
                                                    "max-w-[85%] md:max-w-[75%] rounded-2xl px-4.5 py-3 text-[14.5px] leading-relaxed shadow-md select-text",
                                                    isUser
                                                        ? "bg-primary/10 border border-primary/20 text-foreground"
                                                        : "bg-muted/30 border border-border rounded-2xl text-foreground"
                                                )}
                                            >
                                                <Markdown
                                                    components={{
                                                        p: (props) => <p className="mb-3 last:mb-0" {...props} />,
                                                        ul: (props) => <ul className="mb-3 list-disc pl-5 space-y-1" {...props} />,
                                                        ol: (props) => <ol className="mb-3 list-decimal pl-5 space-y-1" {...props} />,
                                                        code({ className, children, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || "")
                                                            const isInline = !className
                                                            if (isInline) {
                                                                return (
                                                                    <code className="rounded bg-muted border border-border px-1.5 py-0.5 text-xs text-rose-400 dark:text-rose-300 font-mono" {...props}>
                                                                        {children}
                                                                    </code>
                                                                )
                                                            }
                                                            const codeText = String(children).replace(/\n$/, "")
                                                            return <CodeBlock code={codeText} language={match ? match[1] : "code"} />
                                                        }
                                                    }}
                                                >
                                                    {item.content}
                                                </Markdown>
                                            </div>
                                            {!isUser && (
                                                <div className="opacity-0 group-hover/message:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                                                    <CopyButton text={item.content} />
                                                </div>
                                            )}
                                        </MessageContent>
                                    </Message>
                                </motion.div>
                            )
                        })}

                        {sendMessage.isPending && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
                            >
                                <Message align="start">
                                    <MessageAvatar className="self-start">
                                        <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-8 border border-white/[0.06] rounded-full animate-pulse" />
                                    </MessageAvatar>
                                    <MessageContent>
                                        <MessageHeader>
                                            <span className="font-semibold text-foreground">{data.agent?.name || "Gemini Assistant"}</span>
                                        </MessageHeader>
                                        <div className="bg-muted/30 border border-border rounded-2xl rounded-tl-none px-4.5 py-3 text-sm text-muted-foreground flex items-center gap-2 max-w-fit shadow-md">
                                            <RefreshCw className="size-3.5 animate-spin text-[#8b5cf6]" />
                                            <span>Assistant is writing...</span>
                                        </div>
                                    </MessageContent>
                                </Message>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </MessageGroup>
                </div>

                {/* ── Fixed Bottom Message Input ── */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-transparent pb-6 pt-16 px-4 z-20 select-none">
                    <div className="mx-auto w-full max-w-3xl">
                        <ChatInput
                            value={message}
                            onChange={setMessage}
                            onSend={handleSend}
                            placeholder={`Message ${selectedInputAgent?.name || "Assistant"}...`}
                            selectedAgent={selectedInputAgent}
                            onSelectAgent={setSelectedInputAgent}
                            agentsList={agentsList}
                            isPending={sendMessage.isPending}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export const ChatIdViewLoading = () => {
    return <LoadingState title="Loading Chat" description="This may take a few seconds" />
}

export const ChatIdViewError = () => {
    return <ErrorState title="Error Loading Chat" description="Please try again later" />
}
