"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useChatsFilters } from "../../params"

export const ChatsSearchFilter = () => {
    const [filters, setFilters] = useChatsFilters()

    return (
        <div className="relative w-full sm:w-auto">
            <Input
                placeholder="Search chats..."
                value={filters.search}
                onChange={(event) => setFilters({ search: event.target.value, page: 1 })}
                className="h-10 w-full rounded-full border border-foreground/5 bg-muted/40! pl-9 md:w-[280px]"
            />
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}
