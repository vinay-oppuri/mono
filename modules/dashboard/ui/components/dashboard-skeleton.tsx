import { Skeleton } from "@/components/ui/skeleton"

export const DashboardSkeleton = () => {
  return (
    <div className="flex h-full flex-col bg-[#0D0F12]">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-52 pt-20 md:px-6">
          {/* Greeting skeleton */}
          <div className="mb-12 flex flex-col items-center gap-4 w-full">
            <Skeleton className="h-6 w-40 rounded-full bg-white/[0.06]" />
            <Skeleton className="h-12 w-72 md:w-96 bg-white/[0.06]" />
            <Skeleton className="h-5 w-52 bg-white/[0.04]" />
          </div>
          {/* Prompt cards skeleton */}
          <div className="grid w-full grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <Skeleton className="h-4 w-20 mb-2 bg-white/[0.06]" />
                <Skeleton className="h-3 w-32 bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Input area skeleton */}
      <div className="absolute bottom-0 left-0 right-0 pb-6 pt-12 px-4">
        <div className="mx-auto w-full max-w-3xl">
          <Skeleton className="h-16 w-full rounded-2xl bg-white/[0.06]" />
        </div>
      </div>
    </div>
  )
}
