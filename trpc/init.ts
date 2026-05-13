import { db } from '@/db';
import { agents, chats } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_CHATS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })
  }

  return next({ ctx: { ...ctx, auth: session } })
})
export const premiumProcedure = (entity: "chats" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id
    })

    const [userChats] = await db
      .select({
        count: count(chats.id)
      })
      .from(chats)
      .where(eq(chats.userId, ctx.auth.user.id))

    const [userAgents] = await db
      .select({
        count: count(agents.id)
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id))

    const isPremium = customer.activeSubscriptions.length > 0

    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS
    const isFreeChatLimitReached = userChats.count >= MAX_FREE_CHATS

    const shouldThrowAgentError =
      entity === "agents" && isFreeAgentLimitReached && !isPremium
    const shouldThrowChatError =
      entity === "chats" && isFreeChatLimitReached && !isPremium

    if (shouldThrowAgentError) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You have reached the maximum number of free agents" })
    }

    if (shouldThrowChatError) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You have reached the maximum number of free chats" })
    }

    return next({ ctx: { ...ctx, customer } })
  })
