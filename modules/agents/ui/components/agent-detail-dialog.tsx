"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"
import { MessageSquare, Save, Trash2, Plus, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { useConfirm } from "@/hooks/use-confirm"

interface AgentDetailDialogProps {
  agentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AgentDetailDialog = ({
  agentId,
  open,
  onOpenChange,
}: AgentDetailDialogProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Form states
  const [name, setName] = useState("")
  const [instructions, setInstructions] = useState("")

  // Fetch agent details
  const agentQuery = useQuery({
    ...trpc.agents.getOne.queryOptions({ id: agentId || "" }),
    enabled: !!agentId && open,
  })
  const agent = agentQuery.data

  // Fetch agent chats
  const chatsQuery = useQuery({
    ...trpc.chats.getMany.queryOptions({ agentId: agentId || "", pageSize: 30 }),
    enabled: !!agentId && open,
  })
  const chats = chatsQuery.data?.items ?? []

  // Update form inputs when data loads
  useEffect(() => {
    if (agent) {
      setName(agent.name)
      setInstructions(agent.instructions || "")
    }
  }, [agent])

  // Deletion confirmation helper
  const [DeleteConfirmation, confirmDelete] = useConfirm(
    "Delete Agent?",
    `This will permanently remove "${agent?.name}" and delete all associated conversations.`
  )

  // Mutations
  const updateAgentMutation = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Agent instructions updated")
        await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: agentId || "" }))
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update instructions")
      }
    })
  )

  const deleteAgentMutation = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        toast.success("Agent deleted successfully")
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        onOpenChange(false)
        router.push("/dashboard/agents")
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete agent")
      }
    })
  )

  const startChatMutation = useMutation(
    trpc.chats.create.mutationOptions({
      onSuccess: (chat) => {
        toast.success("Started conversation!")
        onOpenChange(false)
        router.push(`/dashboard/chats/${chat.id}`)
      },
      onError: (err) => {
        toast.error(err.message || "Failed to start conversation")
      }
    })
  )

  const handleSaveChanges = () => {
    if (!agentId || !name.trim()) return
    updateAgentMutation.mutate({
      id: agentId,
      name: name.trim(),
      instructions: instructions.trim(),
    })
  }

  const handleDeleteAgent = async () => {
    if (!agentId) return
    const ok = await confirmDelete()
    if (ok) {
      await deleteAgentMutation.mutateAsync({ id: agentId })
    }
  }

  const handleStartChat = () => {
    if (!agentId || !agent) return
    onOpenChange(false)
    router.push(`/dashboard?agentId=${agentId}`)
  }

  if (!agentId) return null

  return (
    <>
      <DeleteConfirmation />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl! w-full! p-0 overflow-hidden bg-[#14171f] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col md:flex-row h-[80vh] max-h-[600px]">
          
          {/* ── Left Column: Chat History ── */}
          <div className="flex-1 flex flex-col border-r border-white/[0.08] min-h-0 bg-[#0d0f12]/40">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chat History</h4>
                <p className="text-[11px] text-[#8892b0] mt-0.5">Conversations with this agent</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleStartChat}
                className="h-8 gap-1 text-xs border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[#8892b0] hover:text-white"
              >
                <Plus className="size-3" />
                <span>New Chat</span>
              </Button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
              {chatsQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Loader2 className="size-5 text-[#8b5cf6] animate-spin" />
                  <span className="text-xs text-[#8892b0]">Loading history...</span>
                </div>
              ) : chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onOpenChange(false)
                      router.push(`/dashboard/chats/${chat.id}`)
                    }}
                    className="w-full text-left p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all flex items-center gap-3 group"
                  >
                    <div className="size-8 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center shrink-0">
                      <MessageSquare className="size-4 text-[#8b5cf6]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white/90 truncate group-hover:text-white transition-colors capitalize">
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-[#8892b0]/70 mt-0.5">
                        {chat.messageCount} messages
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <MessageSquare className="size-7 text-[#8892b0]/30 mb-2" />
                  <p className="text-xs text-[#8892b0]/80">No chats yet</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={handleStartChat}
                    className="text-xs text-[#8b5cf6] font-semibold mt-1"
                  >
                    Start a thread now
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Edit Profile & Delete ── */}
          <div className="flex-1 flex flex-col p-6 min-h-0 justify-between">
            <div className="space-y-5">
              <DialogHeader className="text-left">
                <div className="flex items-center gap-3">
                  {agent && (
                    <GeneratedAvatar 
                      seed={agent.name} 
                      variant="botttsNeutral" 
                      className="size-9 border border-white/[0.06] rounded-full p-0.5" 
                    />
                  )}
                  <div>
                    <DialogTitle className="text-base font-bold text-white">Agent Settings</DialogTitle>
                    <DialogDescription className="text-xs text-[#8892b0]">
                      Configure rules, instructions, and name.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Form Input fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#8892b0]">Agent Name</label>
                  <Input
                    placeholder="e.g. Code Wizard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] focus:border-[#8b5cf6]/60 text-white rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#8892b0]">Instructions</label>
                  <Textarea
                    placeholder="Describe how this agent should behave..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] focus:border-[#8b5cf6]/60 text-white rounded-xl min-h-[140px] text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-4 mt-6">
              {/* Delete Agent on right side itself */}
              <Button
                variant="ghost"
                onClick={handleDeleteAgent}
                disabled={deleteAgentMutation.isPending}
                className="h-9 px-3 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5 cursor-pointer"
              >
                {deleteAgentMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleSaveChanges}
                disabled={updateAgentMutation.isPending || !name.trim()}
                className="h-9 px-4 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold text-xs gap-1.5 cursor-pointer shadow-lg shadow-[#8b5cf6]/20"
              >
                {updateAgentMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>

          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}
