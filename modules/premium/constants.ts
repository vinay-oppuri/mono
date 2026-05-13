"use client"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"

export const MAX_FREE_CHATS = 5
export const MAX_FREE_AGENTS = 5

export const useFreeLimits = () => {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions())
  const isFreeUser = Boolean(data)

  return {
    isFreeUser,
    chatLimit: isFreeUser ? MAX_FREE_CHATS : "",
    agentLimit: isFreeUser ? MAX_FREE_AGENTS : "",
  }
}
