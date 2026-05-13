"use client"

import { useRouter } from "next/navigation"
import { useSuspenseQuery } from "@tanstack/react-query"

import { DataPagination } from "@/components/data-pagination"
import { DataTable } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useChatsFilters } from "../../params"
import { columns } from "../components/columns"

export const ChatsView = () => {
    const router = useRouter()
    const [filters, setFilters] = useChatsFilters()
    const trpc = useTRPC()

    const { data } = useSuspenseQuery(
        trpc.chats.getMany.queryOptions({
            ...filters,
            agentId: filters.agentId || undefined
        })
    )

    return (
        <div className="flex flex-1 flex-col gap-y-4 px-4 pb-24 md:px-8">
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row) => router.push(`/dashboard/chats/${row.id}`)}
            />
            {data.items.length !== 0 && (
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => setFilters({ page })}
                />
            )}
            {data.items.length === 0 && (
                <EmptyState
                    title="Start your first chat"
                    description="Create a chat, choose an agent, and talk with it like ChatGPT or Gemini."
                />
            )}
        </div>
    )
}

export const ChatsViewLoading = () => {
    return <LoadingState title="Loading Chats" description="This may take a few seconds" />
}

export const ChatsViewError = () => {
    return <ErrorState title="Error loading chats" description="Something went wrong" />
}
