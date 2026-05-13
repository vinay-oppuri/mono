"use client"

import { format } from "date-fns"

import { ColumnDef } from "@tanstack/react-table"

import {
    CircleCheckIcon,
    CircleXIcon,
    ClockArrowUpIcon,
    ClockFadingIcon,
    CornerDownRightIcon,
    LoaderIcon
} from "lucide-react"

import { cn, formatDuration } from "@/lib/utils"

import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"

const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheckIcon,
    processing: LoaderIcon,
    cancelled: CircleXIcon
}

const statusColorMap = {
    upcoming: "border-chart-3/20 bg-chart-3/12 text-chart-3",
    active: "border-chart-2/20 bg-chart-2/12 text-chart-2",
    completed: "border-chart-5/20 bg-chart-5/12 text-chart-5",
    processing: "border-muted-foreground/20 bg-muted text-muted-foreground",
    cancelled: "border-chart-4/20 bg-chart-4/12 text-chart-4",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold capitalize">{row.original.name}</span>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                        <CornerDownRightIcon className="size-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                            {row.original.agent.name}
                        </span>
                    </div>
                    <GeneratedAvatar
                        seed={row.original.agent.name}
                        variant="botttsNeutral"
                        className="size-4"
                    />
                    <span className="text-sm text-muted-foreground">
                        {row.original.startedAt ? format(row.original.startedAt, "MMM d") : ""}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]

            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "capitalize [&>svg]:size-4 text-muted-foreground",
                        statusColorMap[row.original.status as keyof typeof statusColorMap]
                    )}
                >
                    <Icon
                        className={cn(
                            row.original.status === "processing" && "animate-spin text-chart-2",
                        )}
                    />
                    {row.original.status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="capitalize [&>svg]:size-4 text-muted-foreground"
            >
                <ClockFadingIcon className="text-chart-2"/>
                {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
            </Badge>
        )
    }
]
