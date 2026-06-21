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
            <div className="flex flex-col gap-4 px-4 pt-8 pb-4 md:px-8 bg-[#0D0F12]">
                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-2xl font-bold tracking-tight text-white mb-1">Chats</h5>
                        <p className="text-sm text-[#8892b0]">Resume a thread or start a new conversation with an agent.</p>
                    </div>
                    <Button 
                        onClick={() => setOpenNewChatDialog(true)} 
                        className="rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/20 transition-all font-semibold"
                    >
                        <PlusIcon className="size-4 mr-1.5" /> <span className="hidden md:flex">New Chat</span>
                    </Button>
                </div>
                <ChatsSearchFilter />
            </div>
        </>
    )
}
