"use client"

import { useRouter } from "next/navigation"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import { ChatForm } from "./chat-form"

interface NewChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const NewChatDialog = ({ open, onOpenChange }: NewChatDialogProps) => {
    const router = useRouter()

    return (
        <ResponsiveDialog
            title="New Chat"
            description="Choose an agent and start a direct conversation."
            open={open}
            onOpenChange={onOpenChange}
        >
            <ChatForm
                onSuccess={(id) => {
                    onOpenChange(false)
                    if (id) router.push(`/dashboard/chats/${id}`)
                }}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}
