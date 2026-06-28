import { Skeleton } from "@/components/ui/skeleton"

export const DashboardSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col bg-background text-foreground overflow-hidden select-none">
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full max-w-xl mx-auto z-10">
        
        {/* Chat input skeleton - centered, pill shape */}
        <div className="w-full relative border border-border backdrop-blur-md rounded-full bg-card/80 p-4 flex items-center justify-between h-[56px] mb-8">
          <Skeleton className="h-4 w-48 bg-muted/40 ml-2" />
          <Skeleton className="size-9 rounded-full bg-muted/60 shrink-0" />
        </div>

        {/* Quick start with agents title */}
        <div className="flex items-center justify-between w-full max-w-xl mb-5 px-2">
          <Skeleton className="h-3 w-32 bg-muted/40" />
        </div>

        {/* 4 Agent cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl w-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-[135px] p-5 rounded-2xl border border-border bg-card text-center shadow-lg shadow-black/25"
            >
              <div className="relative mb-3.5">
                <Skeleton className="size-12 rounded-full bg-muted/60" />
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full border border-border bg-card flex items-center justify-center">
                  <Skeleton className="size-2.5 rounded-full bg-muted/40" />
                </div>
              </div>
              <Skeleton className="h-3 w-16 bg-muted/60 mb-2" />
              <Skeleton className="h-2 w-10 bg-muted/40" />
            </div>
          ))}
        </div>

        {/* Footer warning skeleton */}
        <Skeleton className="h-3 w-64 bg-muted/30 mt-8" />

      </div>
    </div>
  )
}
