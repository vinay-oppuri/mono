"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MessageCircleIcon, BotIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { ChatGetMany } from "../../types"

export const columns: ColumnDef<ChatGetMany[number]>[] = [
    {
        accessorKey: "title",
        header: "Chat",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold capitalize">{row.original.title}</span>
                <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <GeneratedAvatar
                        seed={row.original.agent.name}
                        variant="botttsNeutral"
                        className="size-5"
                    />
                    <span className="truncate">{row.original.agent.name}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "messageCount",
        header: "Messages",
        cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <MessageCircleIcon className="text-chart-2" />
                {row.original.messageCount}
            </Badge>
        )
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2 text-muted-foreground">
                <BotIcon className="size-4" />
                <span>{formatDistanceToNow(row.original.updatedAt, { addSuffix: true })}</span>
            </div>
        )
    }
]
