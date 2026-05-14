import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const DashboardSkeleton = () => {
  return (
    <div className="bg-card/60 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-24 md:px-8 md:py-8">
      {/* Welcome Section Skeleton */}
      <section className="rounded-lg border border-foreground/5 bg-card p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-64 md:w-80" />
            <Skeleton className="h-4 w-full md:w-96" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Cards Skeleton */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-foreground/5 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16" />
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Lists Skeleton */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-foreground/5 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 rounded-md border border-foreground/5 p-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-foreground/5 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-20" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
