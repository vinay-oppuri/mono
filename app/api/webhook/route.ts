import { NextResponse } from "next/server"

export async function POST() {
    return NextResponse.json(
        { status: "disabled", message: "Meeting webhooks are no longer used. Use agent chats instead." },
        { status: 410 }
    )
}
