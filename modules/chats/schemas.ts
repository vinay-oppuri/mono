import { z } from "zod"

export const chatsInsertSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    agentId: z.string().min(1, { message: "Agent is required" })
})

export const chatsUpdateSchema = chatsInsertSchema.extend({
    id: z.string().min(1, "Id is required")
})

export const sendMessageSchema = z.object({
    chatId: z.string().min(1, "Chat is required"),
    content: z.string().min(1, "Message is required")
})
