import { EmptyState } from "@/components/empty-state"

export const ProcessingState = () => {

    return (
        <div className="bg-background flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-y-8 shadow-primary/40 shadow-sm">
            <EmptyState
                image="/processing.svg"
                title="Meeting completed"
                description="This meeting was completed, a summary will appear soon"
            />
        </div>
    )
}