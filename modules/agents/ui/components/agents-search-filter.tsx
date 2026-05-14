import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
    const [filters, setFilters] = useAgentsFilters()

    return (
        <div className="relative w-full sm:w-auto">
            <Input
                placeholder="Filter by name"
                value={filters.search}
                className="h-10 w-full rounded-full bg-muted/30! pl-10 sm:w-[280px]"
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        </div>
    )
}
