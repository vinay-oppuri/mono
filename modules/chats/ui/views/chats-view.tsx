"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { MessageSquare, Trash2, Loader2, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { DataPagination } from "@/components/data-pagination"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { useTRPC } from "@/trpc/client"
import { useChatsFilters } from "../../params"
import { useConfirm } from "@/hooks/use-confirm"
import { motion } from "framer-motion"

export const ChatsView = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [filters, setFilters] = useChatsFilters()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    // Read search params for auto-chat trigger
    const q = searchParams.get("q")
    const queryAgentId = searchParams.get("agentId")
    const [isCreatingChat, setIsCreatingChat] = useState(false)

    // Suspense query for chat list
    const { data } = useSuspenseQuery(
        trpc.chats.getMany.queryOptions({
            ...filters,
            agentId: filters.agentId || undefined
        })
    )

    // Fetch agents to check availability
    const agentsQuery = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 5 }))
    const agents = agentsQuery.data?.items ?? []

    // Confirm dialog helper for list deletion
    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete chat thread?",
        "This will permanently erase the message history of this conversation."
    )
    const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

    // Mutations
    const createChatMutation = useMutation(
        trpc.chats.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
            }
        })
    )

    const sendMessageMutation = useMutation(
        trpc.chats.sendMessage.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
            }
        })
    )

    const removeChatMutation = useMutation(
        trpc.chats.remove.mutationOptions({
            onSuccess: async () => {
                toast.success("Chat deleted successfully")
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    // Auto-create chat effect when user uses the landing page prompt input
    useEffect(() => {
        if (q) {
            const autoCreateChat = async () => {
                setIsCreatingChat(true)
                try {
                    const titleStr = q.length > 30 ? q.slice(0, 30) + "..." : q
                    const createdChat = await createChatMutation.mutateAsync({
                        title: titleStr,
                        agentId: queryAgentId || undefined
                    })

                    await sendMessageMutation.mutateAsync({
                        chatId: createdChat.id,
                        content: q
                    })

                    toast.success("Conversation started!")
                    router.push(`/dashboard/chats/${createdChat.id}`)
                } catch (err: any) {
                    console.error("Auto-start chat error", err)
                    toast.error(err.message || "Failed to start conversation")
                    setIsCreatingChat(false)
                }
            }
            autoCreateChat()
        }
    }, [q, queryAgentId])

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.stopPropagation()
        setActiveDeleteId(chatId)
        const ok = await confirmRemove()
        if (ok) {
            await removeChatMutation.mutateAsync({ id: chatId })
        }
        setActiveDeleteId(null)
    }

    if (isCreatingChat) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] text-center gap-y-4 px-4 bg-[#0D0F12]">
                <div className="relative">
                    <Loader2 className="size-10 text-[#8b5cf6] animate-spin" />
                    <SparklesIcon className="size-4 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Initializing Assistant</h3>
                    <p className="text-sm text-[#8892b0] mt-1 max-w-sm">Please wait while we establish your conversation thread...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-y-6 px-4 pb-24 md:px-8 bg-[#0D0F12]">
            <RemoveConfirmation />
            
            {data.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.items.map((chat) => (
                        <motion.div
                            key={chat.id}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => router.push(`/dashboard/chats/${chat.id}`)}
                            className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <GeneratedAvatar
                                            seed={chat.agent?.name || "Gemini"}
                                            variant="botttsNeutral"
                                            className="size-7 border border-white/[0.05] rounded-full shrink-0"
                                        />
                                        <span className="text-xs font-semibold text-[#8b5cf6]/90 truncate max-w-[120px]">
                                            {chat.agent?.name || "Gemini Assistant"}
                                        </span>
                                    </div>

                                    {/* Action button: delete */}
                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                        disabled={activeDeleteId === chat.id}
                                        className="size-7 rounded-lg flex items-center justify-center text-[#8892b0]/55 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                    >
                                        {activeDeleteId === chat.id ? (
                                            <Loader2 className="size-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="size-3.5" />
                                        )}
                                    </button>
                                </div>

                                <h4 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors capitalize line-clamp-2 leading-snug">
                                    {chat.title}
                                </h4>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 mt-4 text-[11px] text-[#8892b0]/70">
                                <span className="flex items-center gap-1">
                                    <MessageSquare className="size-3 text-[#8b5cf6]/80" />
                                    {chat.messageCount} messages
                                </span>
                                <span>
                                    {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="Start your first chat"
                    description="Create a chat, choose an agent, and talk with it like ChatGPT or Gemini."
                />
            )}

            {data.items.length !== 0 && (
                <div className="mt-4 flex justify-center">
                    <DataPagination
                        page={filters.page}
                        totalPages={data.totalPages}
                        onPageChange={(page) => setFilters({ page })}
                    />
                </div>
            )}
        </div>
    )
}

import { SparklesIcon } from "lucide-react"

export const ChatsViewLoading = () => {
    return <LoadingState title="Loading Chats" description="This may take a few seconds" />
}

export const ChatsViewError = () => {
    return <ErrorState title="Error loading chats" description="Something went wrong" />
}
