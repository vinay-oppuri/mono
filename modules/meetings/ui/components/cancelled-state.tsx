import { EmptyState } from "@/components/empty-state"

export const CancelledState = () => {

    return (
        <div className="bg-background flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-y-8 shadow-primary/40 shadow-sm">
            <EmptyState
                image="/cancelled.svg"
                title="Meeting cancelled"
                description="This meeting was cancelled"
            />
        </div>
    )
}