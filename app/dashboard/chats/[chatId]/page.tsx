import { ErrorBoundary } from "react-error-boundary"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"

import { getQueryClient, trpc } from "@/trpc/server"
import { ChatIdView, ChatIdViewError, ChatIdViewLoading } from "@/modules/chats/ui/views/chat-id-view"

interface Props {
  params: Promise<{
    chatId: string
  }>
}

const Page = async ({ params }: Props) => {
  const { chatId } = await params
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.chats.getOne.queryOptions({ id: chatId }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ChatIdViewLoading />}>
        <ErrorBoundary fallback={<ChatIdViewError />}>
          <ChatIdView chatId={chatId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page
