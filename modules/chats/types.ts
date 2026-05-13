import { inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "@/trpc/routers/_app"

export type ChatGetOne = inferRouterOutputs<AppRouter>["chats"]["getOne"]
export type ChatGetMany = inferRouterOutputs<AppRouter>["chats"]["getMany"]["items"]
