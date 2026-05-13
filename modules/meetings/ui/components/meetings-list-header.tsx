"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, X } from "lucide-react"
import { NewMeetingDialog } from "./new-meeting-dialog"
import { useState } from "react"
import { MeetingsSearchFilter } from "./meetings-search-filter"
import { StatusFilter } from "./status-filter"
import { AgentIdFilter } from "./agent-id-filter"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { DEFAULT_PAGE } from "@/constants"

export const MeetingsListHeader = () => {
    const [filters, setFilters] = useMeetingsFilters()
    const [isDialogOen, setIsDialogOpen] = useState(false)

    const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId

    const onClearFilters = () => {
        setFilters({
            status: null,
            agentId: "",
            search: "",
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            <NewMeetingDialog
                open={isDialogOen}
                onOpenChange={setIsDialogOpen}
            />
            <div className="flex flex-col px-4 md:px-8 py-8 gap-y-4">
                <div className="flex items-center justify-between p-1">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => setIsDialogOpen(true)} className="shadow-primary/40 shadow-md">
                        <PlusIcon /> <p className="hidden md:flex">New Meetings</p>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-4">
                    <div className="flex flex-row gap-3">
                        <MeetingsSearchFilter />
                        {isAnyFilterModified && (
                            <Button
                                variant="outline"
                                onClick={onClearFilters}
                                className="flex md:hidden rounded-full md:ml-auto"
                            >
                                <X className="text-muted-foreground"/> Clear
                            </Button>
                        )}
                    </div>
                    <StatusFilter />
                    <AgentIdFilter />

                    {isAnyFilterModified && (
                        <Button
                            variant="outline"
                            onClick={onClearFilters}
                            className="hidden md:flex rounded-full"
                        >
                            <X className="text-muted-foreground" /> Clear
                        </Button>
                    )}
                </div>

            </div>
        </>
    )
}