import { getQueryClient, trpc } from "@/trpc/server"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { DashboardView, DashboardViewError, DashboardViewLoading } from "@/modules/dashboard/ui/views/dashboard-view"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(trpc.chats.getMany.queryOptions({}))
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<DashboardViewLoading />}>
        <ErrorBoundary fallback={<DashboardViewError />}>
          <DashboardView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
