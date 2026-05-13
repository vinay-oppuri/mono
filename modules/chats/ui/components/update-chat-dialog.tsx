"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import { ChatForm } from "./chat-form"
import { ChatGetOne } from "../../types"

interface UpdateChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValues: ChatGetOne
}

export const UpdateChatDialog = ({ open, onOpenChange, initialValues }: UpdateChatDialogProps) => {
    return (
        <ResponsiveDialog
            title="Edit Chat"
            description="Update the title or assigned agent."
            open={open}
            onOpenChange={onOpenChange}
        >
            <ChatForm
                initialValues={initialValues}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}
