import { z } from "zod"
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

import { db } from "@/db"
import { agents, chatMessages, chats } from "@/db/schema"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { GeminiRequestError, generateAgentReply } from "@/lib/gemini"
import { chatsInsertSchema, chatsUpdateSchema, sendMessageSchema } from "../schemas"

export const chatsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingChat] = await db
                .select({
                    ...getTableColumns(chats),
                    agent: agents
                })
                .from(chats)
                .innerJoin(agents, eq(chats.agentId, agents.id))
                .where(
                    and(
                        eq(chats.id, input.id),
                        eq(chats.userId, ctx.auth.user.id)
                    )
                )

            if (!existingChat) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
            }

            const messages = await db
                .select()
                .from(chatMessages)
                .where(eq(chatMessages.chatId, existingChat.id))
                .orderBy(chatMessages.createdAt, chatMessages.id)

            return {
                ...existingChat,
                messages
            }
        }),

    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
                agentId: z.string().nullish()
            })
        )
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, agentId } = input

            const where = and(
                eq(chats.userId, ctx.auth.user.id),
                search ? ilike(chats.title, `%${search}%`) : undefined,
                agentId ? eq(chats.agentId, agentId) : undefined
            )

            const data = await db
                .select({
                    ...getTableColumns(chats),
                    agent: agents,
                    messageCount: db.$count(chatMessages, eq(chats.id, chatMessages.chatId))
                })
                .from(chats)
                .innerJoin(agents, eq(chats.agentId, agents.id))
                .where(where)
                .orderBy(desc(chats.updatedAt), desc(chats.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const total = await db
                .select({ totalCount: count() })
                .from(chats)
                .where(where)

            const totalCount = total[0]?.totalCount ?? 0
            const totalPages = Math.ceil(totalCount / pageSize)

            return {
                items: data,
                total: totalCount,
                totalPages
            }
        }),

    create: protectedProcedure
        .input(chatsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.agentId),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                )

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
            }

            const [createdChat] = await db
                .insert(chats)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                })
                .returning()

            return createdChat
        }),

    update: protectedProcedure
        .input(chatsUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updatedChat] = await db
                .update(chats)
                .set({
                    title: input.title,
                    agentId: input.agentId,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(chats.id, input.id),
                        eq(chats.userId, ctx.auth.user.id)
                    )
                )
                .returning()

            if (!updatedChat) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
            }

            return updatedChat
        }),

    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removedChat] = await db
                .delete(chats)
                .where(
                    and(
                        eq(chats.id, input.id),
                        eq(chats.userId, ctx.auth.user.id)
                    )
                )
                .returning()

            if (!removedChat) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
            }

            return removedChat
        }),

    sendMessage: protectedProcedure
        .input(sendMessageSchema)
        .mutation(async ({ ctx, input }) => {
            const [existingChat] = await db
                .select({
                    ...getTableColumns(chats),
                    agent: agents
                })
                .from(chats)
                .innerJoin(agents, eq(chats.agentId, agents.id))
                .where(
                    and(
                        eq(chats.id, input.chatId),
                        eq(chats.userId, ctx.auth.user.id)
                    )
                )

            if (!existingChat) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
            }

            const [userMessage] = await db
                .insert(chatMessages)
                .values({
                    chatId: input.chatId,
                    role: "user",
                    content: input.content
                })
                .returning()

            const history = await db
                .select()
                .from(chatMessages)
                .where(eq(chatMessages.chatId, input.chatId))
                .orderBy(chatMessages.createdAt, chatMessages.id)

            let reply: string

            try {
                reply = await generateAgentReply({
                    agentName: existingChat.agent.name,
                    instructions: existingChat.agent.instructions,
                    messages: history.map((message) => ({
                        role: message.role,
                        content: message.content
                    }))
                })
            } catch (error) {
                if (error instanceof GeminiRequestError && error.status === 429) {
                    reply = error.retryAfterSeconds
                        ? `I cannot reply right now because Gemini is rate-limited for this API key. Please try again in about ${error.retryAfterSeconds} seconds, or switch GEMINI_MODEL to another available Gemini model.`
                        : "I cannot reply right now because Gemini is rate-limited or out of quota for this API key. Please try again later, check your Gemini quota/billing, or switch GEMINI_MODEL to another available Gemini model."
                } else {
                await db
                    .delete(chatMessages)
                    .where(eq(chatMessages.id, userMessage.id))

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error instanceof Error ? error.message : "Failed to generate a reply"
                })
                }
            }

            const [assistantMessage] = await db
                .insert(chatMessages)
                .values({
                    chatId: input.chatId,
                    role: "assistant",
                    content: reply
                })
                .returning()

            await db
                .update(chats)
                .set({ updatedAt: new Date() })
                .where(eq(chats.id, input.chatId))

            return {
                userMessage,
                assistantMessage
            }
        })
})
