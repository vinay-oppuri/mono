"use client"
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { Channel as StreamChannel } from "stream-chat"

import {
    useCreateChatClient,
    Chat,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react"

import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"

interface Props {
    meetingId: string
    meetingName: string
    userId: string
    userName: string
    userImage: string | undefined
}

export const ChatUI = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage
}: Props) => {
    const trpc = useTRPC()
    const { mutateAsync: generateChatToken } = useMutation(
        trpc.meetings.generateChatToken.mutationOptions()
    )

    const [channel, setChannel] = useState<StreamChannel>()
    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_CHAT_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: userName,
            image: userImage
        }
    })

    useEffect(() => {
        if(!client) return

        const channel = client.channel("messaging", meetingId, {
            members: [userId]
        })

        setChannel(channel)
    }, [client, meetingId, meetingName, userId])

    if(!client) {
        return (
            <LoadingState
                title="Loading Chat"
                description="This may take a few seconds"
            />
        )
    }

    return (
        <div className="bg-background rounded-lg border overflow-hidden">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] box-border">
                            <MessageList />
                        </div>
                        <MessageInput /> 
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}