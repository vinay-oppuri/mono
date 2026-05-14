"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { NewChatDialog } from "./new-chat-dialog"
import { ChatsSearchFilter } from "./chats-search-filter"

export const ChatsListHeader = () => {
    const [openNewChatDialog, setOpenNewChatDialog] = useState(false)

    return (
        <>
            <NewChatDialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog} />
            <div className="flex flex-col bg-card/60 gap-4 px-4 py-6 md:px-8">
                <div className="flex flex-col gap-3 rounded-lg border border-foreground/5 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-2xl font-semibold tracking-tight">Chats</h5>
                        <p className="text-sm text-muted-foreground">Resume a thread or start a new conversation with an agent.</p>
                    </div>
                    <Button onClick={() => setOpenNewChatDialog(true)} className="rounded-full">
                        <PlusIcon /> <span className="hidden md:flex">New Chat</span>
                    </Button>
                </div>
                <ChatsSearchFilter />
            </div>
        </>
    )
}
