"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, X } from "lucide-react"
import { NewAgentDialog } from "./new-agent-dialog"
import { useState } from "react"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { AgentsSearchFilter } from "./agents-search-filter"
import { DEFAULT_PAGE } from "@/constants"

export const AgentsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [filters, setFilters] = useAgentsFilters()

    const isAntFilterModified = !!filters.search

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="flex flex-col gap-4 px-4 py-6 md:px-8">
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-2xl font-semibold tracking-tight">Agents</h5>
                        <p className="text-sm text-muted-foreground">Create focused assistants for recurring work.</p>
                    </div>
                    <Button onClick={() => { setIsDialogOpen(true) }} className="rounded-full">
                        <PlusIcon /> <p className="hidden md:flex">New Agent</p>
                    </Button>
                </div>
                <div className="relative flex items-center gap-x-2">
                    <AgentsSearchFilter />
                    {isAntFilterModified && (
                        <Button variant="outline" className="rounded-full bg-card" onClick={onClearFilters}>
                            <X className="text-muted-foreground"/>Clear
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
