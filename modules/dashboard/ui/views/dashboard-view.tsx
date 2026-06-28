"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React, { memo, useState, useEffect } from "react"
import {
  SparklesIcon,
  Plus,
  Check,
  Loader2,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { DashboardSkeleton } from "../components/dashboard-skeleton"
import { ErrorState } from "@/components/error-state"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"
import { AgentDetailDialog } from "@/modules/agents/ui/components/agent-detail-dialog"
import { ChatIdView } from "@/modules/chats/ui/views/chat-id-view"
import { motion } from "motion/react"
import { ChatInput } from "@/components/chat-input"

export const DashboardView = memo(function DashboardView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState("")
  const queryAgentId = searchParams.get("agentId")
  const chatId = searchParams.get("chatId")
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(queryAgentId)
  const [newAgentDialogOpen, setNewAgentDialogOpen] = useState(false)
  const [detailAgentId, setDetailAgentId] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const agentsQuery = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 50 }))
  const agents = agentsQuery.data?.items ?? []
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null

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

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (queryAgentId) {
      setSelectedAgentId(queryAgentId)
    }
  }, [queryAgentId])


  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const content = message.trim()
    if (!content || isCreatingChat) return

    setIsCreatingChat(true)
    try {
      const titleStr = content.length > 30 ? content.slice(0, 30) + "..." : content
      const createdChat = await createChatMutation.mutateAsync({
        title: titleStr,
        agentId: selectedAgentId || undefined
      })

      await sendMessageMutation.mutateAsync({
        chatId: createdChat.id,
        content: content
      })

      setMessage("")

      const params = new URLSearchParams(searchParams.toString())
      params.set("chatId", createdChat.id)
      params.delete("q")
      router.push(`/dashboard?${params.toString()}`)
    } catch (err: any) {
      console.error("Failed to start conversation", err)
      toast.error(err.message || "Failed to start conversation")
    } finally {
      setIsCreatingChat(false)
    }
  }


  if (!mounted) return <DashboardViewLoading />

  if (chatId) {
    return <ChatIdView chatId={chatId} />
  }

  if (isCreatingChat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] text-center gap-y-4 px-4 bg-background text-foreground h-full select-none">
        <div className="relative">
          <Loader2 className="size-10 text-primary animate-spin" />
          <SparklesIcon className="size-4 text-emerald-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Initializing Assistant</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Please wait while we establish your conversation thread...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col bg-background text-foreground overflow-hidden select-none">
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full max-w-xl mx-auto z-10">

        {/* Chat input box */}
        <ChatInput
          value={message}
          onChange={setMessage}
          onSend={handleSend}
          placeholder="Message Mono or type prompt..."
          selectedAgent={selectedAgent}
          onDeselectAgent={() => setSelectedAgentId(null)}
          isPending={isCreatingChat}
          className="mb-8"
        />

        {/* Centered Active Agents View with clean UI */}
        {agents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full flex flex-col items-center"
          >
            <div className="flex items-center justify-between w-full max-w-xl mb-5 px-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick start with agents</h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl w-full">
              {agents.slice(0, 4).map((agent) => {
                const isSelected = selectedAgentId === agent.id
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId((prev) => (prev === agent.id ? null : agent.id))
                    }}
                    className={cn(
                      "group relative flex flex-col items-center justify-center w-[135px] p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.03] text-center shadow-lg shadow-black/25",
                      isSelected
                        ? "border-ring bg-ring/20"
                        : "border-border bg-card hover:border-ring/40 hover:bg-ring/5"
                    )}
                  >
                    <div className="relative mb-3.5">
                      <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-12 transition-transform group-hover:scale-105 duration-200 border border-border rounded-full p-0.5 bg-muted/20" />
                      <div className={cn(
                        "absolute -bottom-1 -right-1 size-5 rounded-full border flex items-center justify-center shadow-sm transition-colors",
                        isSelected
                          ? "bg-ring border-ring"
                          : "bg-background border-border"
                      )}>
                        {isSelected ? (
                          <Check className="size-2.5 text-white animate-in zoom-in-50 duration-200" />
                        ) : (
                          <Plus className="size-2.5 text-muted-foreground group-hover:text-ring transition-colors" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-foreground/90 truncate w-full group-hover:text-ring transition-colors">{agent.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 font-medium">{agent.chatCount} {agent.chatCount === 1 ? 'chat' : 'chats'}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        <p className="mt-8 text-center text-[10px] text-muted-foreground/50 tracking-wide">
          Mono can make mistakes. Please check sensitive information.
        </p>

      </div>

      <NewAgentDialog open={newAgentDialogOpen} onOpenChange={setNewAgentDialogOpen} />

      {/* Agent Detail double-column Dialog */}
      <AgentDetailDialog
        agentId={detailAgentId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  )
})

export const DashboardViewLoading = () => <DashboardSkeleton />

export const DashboardViewError = () => (
  <ErrorState title="Error" description="Please try again later" />
)
