"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Home,
  MessageCircleIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { cn } from "@/lib/utils"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"
import { AgentDetailDialog } from "@/modules/agents/ui/components/agent-detail-dialog"
import { useSession } from "@/lib/auth-client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"

export const DashboardSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const { data: session } = useSession()

  const [agentsOpen, setAgentsOpen] = useState(true)
  const [chatsOpen, setChatsOpen] = useState(true)
  const [newAgentDialogOpen, setNewAgentDialogOpen] = useState(false)
  const [detailAgentId, setDetailAgentId] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const trpc = useTRPC()
  const agentsQuery = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 50 }))
  const chatsQuery = useQuery(trpc.chats.getMany.queryOptions({ pageSize: 30 }))

  const agents = agentsQuery.data?.items ?? []
  const chats = chatsQuery.data?.items ?? []

  const handleNav = (href: string) => {
    router.push(href)
    if (isMobile) setOpenMobile(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <NewAgentDialog open={newAgentDialogOpen} onOpenChange={setNewAgentDialogOpen} />
      <AgentDetailDialog agentId={detailAgentId} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />

      <Sidebar className="border-r border-white/[0.06] bg-[#0D0F12] flex flex-col" side="left">
        {/* ── Header: Logo ── */}
        <SidebarHeader className="px-4 pt-5 pb-2">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => isMobile && setOpenMobile(false)}>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={26}
                height={26}
                className="dark:invert shrink-0"
              />
              <span className="text-white font-semibold text-base tracking-tight">Mono</span>
            </Link>
          </div>
        </SidebarHeader>

        {/* ── Navigation ── */}
        <SidebarContent className="flex-1 overflow-y-auto px-2 py-2 bg-[#0D0F12] space-y-0.5 scrollbar-none">

          {/* Home */}
          <button
            onClick={() => handleNav("/dashboard")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
              isActive("/dashboard")
                ? "bg-white/[0.08] text-white font-medium"
                : "text-[#8892b0] hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <Home className="size-4 shrink-0" />
            Home
          </button>

          {/* ── Agents Section ── */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-3 py-1.5 group">
              <button
                onClick={() => setAgentsOpen(!agentsOpen)}
                className="flex items-center gap-2 text-xs font-medium text-[#8892b0] hover:text-white transition-colors uppercase tracking-wider"
              >
                {agentsOpen
                  ? <ChevronDownIcon className="size-3" />
                  : <ChevronRightIcon className="size-3" />
                }
                Agents
              </button>
              <button
                onClick={() => setNewAgentDialogOpen(true)}
                title="New Agent"
                className="size-5 rounded flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/[0.08] transition-colors opacity-0 group-hover:opacity-100"
              >
                <PlusIcon className="size-3.5" />
              </button>
            </div>

            {agentsOpen && (
              <div className="space-y-0.5 pb-1">
                {/* New Agent button always at top */}
                <button
                  onClick={() => setNewAgentDialogOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8892b0] hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                >
                  <div className="size-5 rounded border border-dashed border-white/20 flex items-center justify-center shrink-0">
                    <PlusIcon className="size-3 text-[#8892b0]" />
                  </div>
                  <span className="truncate">New Agent</span>
                </button>

                {agentsQuery.isLoading && (
                  <div className="px-3 py-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="size-5 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
                        <div className="h-3 flex-1 rounded bg-white/[0.06] animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}

                {agents.map((agent) => {
                  const isAgentActive = detailDialogOpen && detailAgentId === agent.id
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setDetailAgentId(agent.id)
                        setDetailDialogOpen(true)
                        if (isMobile) setOpenMobile(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                        isAgentActive
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-[#8892b0] hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      <GeneratedAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="size-5 shrink-0"
                      />
                      <span className="truncate text-left">{agent.name}</span>
                      {agent.chatCount > 0 && (
                        <span className="ml-auto text-[10px] text-[#8892b0] tabular-nums shrink-0">{agent.chatCount}</span>
                      )}
                    </button>
                  )
                })}

                {!agentsQuery.isLoading && agents.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#8892b0]/60 italic">No agents yet</p>
                )}
              </div>
            )}
          </div>

          {/* ── Chats Section ── */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-3 py-1.5 group">
              <button
                onClick={() => setChatsOpen(!chatsOpen)}
                className="flex items-center gap-2 text-xs font-medium text-[#8892b0] hover:text-white transition-colors uppercase tracking-wider"
              >
                {chatsOpen
                  ? <ChevronDownIcon className="size-3" />
                  : <ChevronRightIcon className="size-3" />
                }
                Chats
              </button>
              <button
                onClick={() => handleNav("/dashboard")}
                title="New Chat"
                className="size-5 rounded flex items-center justify-center text-[#8892b0] hover:text-white hover:bg-white/[0.08] transition-colors opacity-0 group-hover:opacity-100"
              >
                <PlusIcon className="size-3.5" />
              </button>
            </div>

            {chatsOpen && (
              <div className="space-y-0.5 pb-1">
                {/* New Chat always at top */}
                <button
                  onClick={() => handleNav("/dashboard")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#8892b0] hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                >
                  <div className="size-5 rounded border border-dashed border-white/20 flex items-center justify-center shrink-0">
                    <PlusIcon className="size-3 text-[#8892b0]" />
                  </div>
                  <span className="truncate">New Chat</span>
                </button>

                {chatsQuery.isLoading && (
                  <div className="px-3 py-2 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-3 rounded bg-white/[0.06] animate-pulse" />
                    ))}
                  </div>
                )}

                {chats.map((chat) => {
                  const chatHref = `/dashboard/chats/${chat.id}`
                  return (
                    <button
                      key={chat.id}
                      onClick={() => handleNav(chatHref)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left",
                        isActive(chatHref)
                          ? "bg-white/[0.08] text-white font-medium"
                          : "text-[#8892b0] hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      <MessageCircleIcon className="size-4 shrink-0 opacity-50" />
                      <span className="truncate flex-1">{chat.title}</span>
                    </button>
                  )
                })}

                {!chatsQuery.isLoading && chats.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#8892b0]/60 italic">No chats yet</p>
                )}
              </div>
            )}
          </div>
        </SidebarContent>

        {/* ── Footer: User info ── */}
        <SidebarFooter className="px-4 py-4 border-t border-white/[0.06] bg-[#0D0F12]">
          {session?.user && (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{session.user.name}</p>
                <p className="text-[10px] text-[#8892b0] truncate">{session.user.email}</p>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  )
}