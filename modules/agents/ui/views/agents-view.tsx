"use client"

import { useState } from "react"
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MessageSquare, Plus, ArrowRight, Edit, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { DataPagination } from "../../../../components/data-pagination"
import { NewAgentDialog } from "../components/new-agent-dialog"
import { AgentDetailDialog } from "../components/agent-detail-dialog"
import { motion } from "framer-motion"

export const AgentsView = () => {
    const router = useRouter()
    const [filters, setFilters] = useAgentsFilters()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [detailAgentId, setDetailAgentId] = useState<string | null>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [activeCreateChatId, setActiveCreateChatId] = useState<string | null>(null)

    const trpc = useTRPC()
    const queryClient = useQueryClient()

    // Suspense query to load agents
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }))

    // Mutation to directly start a conversation
    const startChatMutation = useMutation(
        trpc.chats.create.mutationOptions({
            onSuccess: (chat) => {
                toast.success(`Started conversation!`)
                router.push(`/dashboard/chats/${chat.id}`)
            },
            onError: (err) => {
                toast.error(err.message || "Failed to start conversation")
                setActiveCreateChatId(null)
            }
        })
    )

    const handleStartChat = async (e: React.MouseEvent, agentId: string, agentName: string) => {
        e.stopPropagation()
        setActiveCreateChatId(agentId)
        await startChatMutation.mutateAsync({
            title: `Chat with ${agentName}`,
            agentId: agentId
        })
    }

    return (
        <div className="flex flex-1 flex-col gap-y-6 px-4 pb-24 md:px-8 bg-[#0D0F12]">
            <NewAgentDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
            <AgentDetailDialog agentId={detailAgentId} open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Visual New Agent Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 bg-white/[0.01] hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/5 transition-all duration-200 rounded-xl min-h-[190px] text-center cursor-pointer group"
                >
                    <div className="size-11 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-3 group-hover:border-[#8b5cf6]/40 group-hover:scale-105 transition-all">
                        <Plus className="size-5 text-[#8892b0] group-hover:text-[#8b5cf6] transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors">Create New Agent</span>
                    <p className="text-xs text-[#8892b0]/70 mt-1 max-w-[200px]">Define a customized personality with rules and instructions.</p>
                </motion.div>

                {data.items.map((agent) => (
                    <motion.div
                        key={agent.id}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => {
                            setDetailAgentId(agent.id)
                            setIsDetailDialogOpen(true)
                        }}
                        className="group relative flex flex-col justify-between p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                    >
                        <div>
                            {/* Card Header: Avatar & Badge */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <GeneratedAvatar
                                        seed={agent.name}
                                        variant="botttsNeutral"
                                        className="size-10 border border-white/[0.05] rounded-full shrink-0 group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-white group-hover:text-[#8b5cf6] transition-colors truncate max-w-[130px]">
                                            {agent.name}
                                        </h4>
                                        <span className="text-[10px] text-[#8892b0]/75 flex items-center gap-1 mt-0.5">
                                            <MessageSquare className="size-3 text-[#8b5cf6]/80" />
                                            {agent.chatCount} {agent.chatCount === 1 ? 'chat' : 'chats'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setDetailAgentId(agent.id)
                                        setIsDetailDialogOpen(true)
                                    }}
                                    className="size-7 rounded-lg flex items-center justify-center text-[#8892b0]/55 hover:text-white hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                    title="Edit instructions"
                                >
                                    <Edit className="size-3.5" />
                                </button>
                            </div>

                            {/* Card Body: instructions */}
                            <p className="text-xs text-[#8892b0] line-clamp-3 leading-relaxed mb-4">
                                {agent.instructions || "No custom instructions provided."}
                            </p>
                        </div>

                        {/* Card Footer: Chat Button */}
                        <div className="border-t border-white/[0.04] pt-3 mt-auto">
                            <button
                                onClick={(e) => handleStartChat(e, agent.id, agent.name)}
                                disabled={activeCreateChatId === agent.id}
                                className="w-full h-8.5 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#c4b5fd] hover:bg-[#8b5cf6]/20 transition-all duration-150 flex items-center justify-center gap-1.5 text-xs font-semibold"
                            >
                                {activeCreateChatId === agent.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Chat Now</span>
                                        <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

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

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few seconds"
        />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error loading agents"
            description="Something went wrong"
        />
    )
}
