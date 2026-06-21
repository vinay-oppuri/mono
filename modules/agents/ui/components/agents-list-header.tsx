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
            <div className="flex flex-col gap-4 px-4 pt-8 pb-4 md:px-8 bg-[#0D0F12]">
                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.01] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h5 className="text-2xl font-bold tracking-tight text-white mb-1">Agents</h5>
                        <p className="text-sm text-[#8892b0]">Create focused assistants for recurring work.</p>
                    </div>
                    <Button 
                        onClick={() => setIsDialogOpen(true)} 
                        className="rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/20 transition-all font-semibold"
                    >
                        <PlusIcon className="size-4 mr-1.5" /> <span className="hidden md:flex">New Agent</span>
                    </Button>
                </div>
                <div className="relative flex items-center gap-x-2">
                    <AgentsSearchFilter />
                    {isAntFilterModified && (
                        <Button 
                            variant="ghost" 
                            className="rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] text-[#8892b0] hover:text-white transition-all text-xs h-9 px-3" 
                            onClick={onClearFilters}
                        >
                            <X className="size-3.5 mr-1" />Clear
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
