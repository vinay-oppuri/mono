"use client"

import { Dispatch, SetStateAction, useState } from "react"
import {
    CommandResponsiveDialog,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
    CommandEmpty,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { GeneratedAvatar } from "@/components/generated-avatar"

interface Props {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const trpc = useTRPC()
    const chats = useQuery(trpc.chats.getMany.queryOptions({search, pageSize: 100}))
    const agents = useQuery(trpc.agents.getMany.queryOptions({search, pageSize: 100}))


    return (
        <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Find a chat or agent..."
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                <CommandGroup heading="Chats">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No chats found
                        </span>
                    </CommandEmpty>
                    {chats.data?.items.map((chat) => (
                        <CommandItem key={chat.id}
                            onSelect={() => {
                                router.push(`/dashboard/chats/${chat.id}`)
                                setOpen(false)
                            }}
                        >
                            {chat.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Agents">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No agents found
                        </span>
                    </CommandEmpty>
                    {agents.data?.items.map((agent) => (
                        <CommandItem
                            key={agent.id}
                            onSelect={() => {
                                router.push(`/dashboard/agents/${agent.id}`)
                                setOpen(false)
                            }}
                        >
                            {agent.name}
                            <GeneratedAvatar
                                seed={agent.name}
                                variant="botttsNeutral"
                                className="size-5"
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    )
}
