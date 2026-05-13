import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

import { getQueryClient, trpc } from "@/trpc/server"
import { ChatsListHeader } from "@/modules/chats/ui/components/chats-list-header"
import { ChatsView, ChatsViewError, ChatsViewLoading } from "@/modules/chats/ui/views/chats-view"
import { loadSearchParams } from "@/modules/chats/params"

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams)
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(
    trpc.chats.getMany.queryOptions({
      ...filters,
      agentId: filters.agentId || undefined
    })
  )

  return (
    <>
      <ChatsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ChatsViewLoading />}>
          <ErrorBoundary fallback={<ChatsViewError />}>
            <ChatsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default Page
