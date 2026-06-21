"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { memo, useState, useEffect, useRef } from "react"
import {
  SendHorizonal,
  BotIcon,
  ChevronDownIcon,
  SparklesIcon,
  Plus,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { DashboardSkeleton } from "../components/dashboard-skeleton"
import { ErrorState } from "@/components/error-state"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"
import { AgentDetailDialog } from "@/modules/agents/ui/components/agent-detail-dialog"
import { motion, AnimatePresence } from "framer-motion"

export const DashboardView = memo(function DashboardView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState("")
  const queryAgentId = searchParams.get("agentId")
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(queryAgentId)
  const [agentPickerOpen, setAgentPickerOpen] = useState(false)
  const [newAgentDialogOpen, setNewAgentDialogOpen] = useState(false)
  const [detailAgentId, setDetailAgentId] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const trpc = useTRPC()
  const agentsQuery = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 50 }))
  const agents = agentsQuery.data?.items ?? []
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (queryAgentId) {
      setSelectedAgentId(queryAgentId)
    }
  }, [queryAgentId])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [message])

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setAgentPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!message.trim()) return
    const params = new URLSearchParams({ q: message })
    if (selectedAgentId) params.set("agentId", selectedAgentId)
    router.push(`/dashboard/chats?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!mounted) return <DashboardViewLoading />

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="relative flex h-full flex-col bg-[#0D0F12] overflow-hidden select-none">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-none z-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-52 pt-28 md:px-6">

          {/* Greeting */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 text-xs text-[#8892b0] shadow-inner">
                <SparklesIcon className="size-3 text-[#8b5cf6]" />
                <span>Powered by customized AI agents</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {greeting()}, {firstName}
            </h1>
            <p className="mt-4 text-base md:text-lg text-[#8892b0] max-w-md mx-auto">
              Choose an agent or ask Mono to pick the best companion for your task.
            </p>
          </motion.div>

          {/* Centered Active Agents View with clean UI */}
          {agents.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full flex flex-col items-center mb-10"
            >
              <div className="flex items-center justify-between w-full max-w-xl mb-5 px-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8892b0]/70">Quick start with agents</h3>
                <Link href="/dashboard/agents" className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-semibold">
                  View all
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl w-full">
                {agents.slice(0, 4).map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setDetailAgentId(agent.id)
                      setDetailDialogOpen(true)
                    }}
                    className="group relative flex flex-col items-center justify-center w-[135px] p-5 rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/5 transition-all duration-300 text-center shadow-lg shadow-black/25"
                  >
                    <div className="relative mb-3.5">
                      <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-12 transition-transform group-hover:scale-105 duration-200 border border-white/[0.05] rounded-full p-0.5 bg-white/[0.01]" />
                      <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#161920] border border-white/[0.08] flex items-center justify-center shadow-sm">
                        <Plus className="size-2.5 text-white/70 group-hover:text-[#8b5cf6] transition-colors" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white/90 truncate w-full group-hover:text-[#8b5cf6] transition-colors">{agent.name}</span>
                    <span className="text-[10px] text-[#8892b0]/70 mt-1 font-medium">{agent.chatCount} {agent.chatCount === 1 ? 'chat' : 'chats'}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Fixed bottom chat input ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D0F12] via-[#0D0F12]/98 to-transparent pb-6 pt-16 px-4 z-20">
        <div className="mx-auto w-full max-w-3xl">

          {/* Agent picker dropdown */}
          <AnimatePresence>
            {agentPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                ref={pickerRef}
                className="absolute bottom-full mb-3 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-3xl mx-auto rounded-xl border border-white/[0.08] bg-[#14171f]/95 backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden z-50"
              >
                <div className="max-h-72 overflow-y-auto scrollbar-none">
                  <div className="p-2.5">
                    <p className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8892b0]/60 border-b border-white/[0.04] mb-1">Select Active Agent</p>

                    {/* No agent option */}
                    <button
                      onClick={() => { setSelectedAgentId(null); setAgentPickerOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors",
                        !selectedAgentId
                          ? "bg-white/[0.06] text-white"
                          : "text-[#8892b0] hover:bg-white/[0.03] hover:text-white"
                      )}
                    >
                      <div className="size-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 border border-white/[0.05]">
                        <SparklesIcon className="size-4 text-[#8b5cf6]" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold text-white/90">Gemini Assistant</p>
                        <p className="text-[11px] text-[#8892b0]/70 truncate">Default chat mode without specific instructions</p>
                      </div>
                      {!selectedAgentId && <div className="ml-auto size-2 rounded-full bg-[#8b5cf6]" />}
                    </button>

                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => { setSelectedAgentId(agent.id); setAgentPickerOpen(false) }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors",
                          selectedAgentId === agent.id
                            ? "bg-[#8b5cf6]/10 text-white"
                            : "text-[#8892b0] hover:bg-white/[0.03] hover:text-white"
                        )}
                      >
                        <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-8 shrink-0" />
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-semibold text-white/95 truncate">{agent.name}</p>
                          <p className="text-[11px] text-[#8892b0]/70 truncate">{agent.chatCount} chats active</p>
                        </div>
                        {selectedAgentId === agent.id && <div className="ml-auto size-2 rounded-full bg-[#8b5cf6]" />}
                      </button>
                    ))}

                    {agents.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-[#8892b0]/70">No agents found in workspace.</p>
                        <button
                          onClick={() => { setAgentPickerOpen(false); setNewAgentDialogOpen(true) }}
                          className="mt-2 text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-semibold"
                        >
                          Create your first agent →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat input box */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#14171f]/80 backdrop-blur-md shadow-2xl shadow-black/40 transition-all duration-200 focus-within:border-white/[0.15] focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.2)]">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Mono or type prompt..."
              rows={1}
              className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-white placeholder:text-[#8892b0]/50 focus:outline-none text-[15px] leading-relaxed min-h-[56px] max-h-[200px]"
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3.5 pb-3">
              {/* Left: Agent picker */}
              <button
                type="button"
                onClick={() => setAgentPickerOpen(!agentPickerOpen)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 border",
                  selectedAgent
                    ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/25 text-[#c4b5fd] hover:bg-[#8b5cf6]/25"
                    : "bg-white/[0.03] border-white/[0.06] text-[#8892b0]/80 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                {selectedAgent ? (
                  <GeneratedAvatar seed={selectedAgent.name} variant="botttsNeutral" className="size-4" />
                ) : (
                  <SparklesIcon className="size-3.5 text-[#8b5cf6]" />
                )}
                <span className="max-w-[120px] truncate">
                  {selectedAgent ? selectedAgent.name : "Gemini Assistant"}
                </span>
                <ChevronDownIcon className={cn("size-3 opacity-60 transition-transform duration-200", agentPickerOpen && "rotate-180")} />
              </button>

              {/* Right: Send button with professional purple accent */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!message.trim()}
                className={cn(
                  "flex items-center justify-center size-9 rounded-xl transition-all duration-150 shrink-0",
                  message.trim()
                    ? "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-[#8b5cf6]/20 cursor-pointer"
                    : "bg-white/[0.03] text-[#8892b0]/30 cursor-not-allowed border border-white/[0.05]"
                )}
              >
                <SendHorizonal className="size-4" />
              </button>
            </div>
          </div>

          <p className="mt-3.5 text-center text-[10px] text-[#8892b0]/40 tracking-wide">
            Mono can make mistakes. Please check sensitive information.
          </p>
        </div>
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
