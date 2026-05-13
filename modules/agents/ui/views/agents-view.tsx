"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { DataTable } from "@/components/data-table"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { DataPagination } from "../../../../components/data-pagination"
import { useRouter } from "next/navigation"


export const AgentsView = () => {
    const router = useRouter()
    const [filters, setFilters] = useAgentsFilters()

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }))


    return (
        <div className="flex flex-1 flex-col gap-y-4 px-4 pb-24 md:px-8">
            <DataTable
                data={data.items}
                columns={columns}
                onRowClick={(row) => router.push(`/dashboard/agents/${row.id}`)}
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
                    title="Create your first agent"
                    description="Create an agent, give it instructions, and chat with it whenever you need help."
                />
            )}
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few seconds"
        />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error loading agents"
            description="Something went wrong"
        />
    )
}
