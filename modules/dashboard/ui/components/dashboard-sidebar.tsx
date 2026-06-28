"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  MessageCircleIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { cn } from "@/lib/utils"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"
import { AgentDetailDialog } from "@/modules/agents/ui/components/agent-detail-dialog"
import { useSession } from "@/lib/auth-client"
import { useConfirm } from "@/hooks/use-confirm"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export const DashboardSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get("chatId")
  const { isMobile, setOpenMobile } = useSidebar()
  const { data: session } = useSession()

  const [agentsOpen, setAgentsOpen] = useState(true)
  const [chatsOpen, setChatsOpen] = useState(true)
  const [newAgentDialogOpen, setNewAgentDialogOpen] = useState(false)
  const [detailAgentId, setDetailAgentId] = useState<string | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const agentsQuery = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 50 }))
  const chatsQuery = useQuery(trpc.chats.getMany.queryOptions({ pageSize: 30 }))

  const agents = agentsQuery.data?.items ?? []
  const chats = chatsQuery.data?.items ?? []

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Delete thread?",
    "This will permanently remove the full message history."
  )

  const removeChat = useMutation(
    trpc.chats.remove.mutationOptions({
      onSuccess: async () => {
        toast.success("Conversation deleted")
        await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
        if (currentChatId) {
          router.push("/dashboard")
        }
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const handleRemoveChat = async (id: string) => {
    const ok = await confirmRemove()
    if (!ok) return
    await removeChat.mutateAsync({ id })
  }

  const handleNav = (href: string) => {
    router.push(href)
    if (isMobile) setOpenMobile(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      <NewAgentDialog open={newAgentDialogOpen} onOpenChange={setNewAgentDialogOpen} />
      <AgentDetailDialog agentId={detailAgentId} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
      <RemoveConfirmation />

      <Sidebar className="border-r border-sidebar-border bg-sidebar flex flex-col" side="left">
        {/* ── Header: Logo ── */}
        <SidebarHeader className="px-4 pt-5 pb-2">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => isMobile && setOpenMobile(false)}>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={26}
                height={26}
                className="dark:invert shrink-0"
              />
              <span className="text-foreground font-semibold text-base tracking-[0.4rem] uppercase">Mono</span>
            </Link>
          </div>
        </SidebarHeader>

        {/* ── Navigation ── */}
        <SidebarContent className="flex-1 overflow-y-auto px-2 py-2 bg-sidebar space-y-0.5 scrollbar-none">
          {/* ── Agents Section ── */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-3 py-1.5 group">
              <button
                onClick={() => setAgentsOpen(!agentsOpen)}
                className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground hover:text-sidebar-foreground transition-colors uppercase tracking-wider"
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
                className="size-5 rounded flex items-center justify-center text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <PlusIcon className="size-3.5" />
              </button>
            </div>

            {agentsOpen && (
              <div className="space-y-0.5 pb-1">
                {/* New Agent button always at top */}
                <button
                  onClick={() => setNewAgentDialogOpen(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
                >
                  <div className="size-5 rounded border border-dashed border-sidebar-border flex items-center justify-center shrink-0">
                    <PlusIcon className="size-3 text-sidebar-foreground" />
                  </div>
                  <span className="truncate">New Agent</span>
                </button>

                {agentsQuery.isLoading && (
                  <div className="px-3 py-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="size-5 rounded-full bg-sidebar-accent/50 animate-pulse shrink-0" />
                        <div className="h-3 flex-1 rounded bg-sidebar-accent/50 animate-pulse" />
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
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <GeneratedAvatar
                        seed={agent.name}
                        variant="botttsNeutral"
                        className="size-5 shrink-0"
                      />
                      <span className="truncate text-left">{agent.name}</span>
                      {agent.chatCount > 0 && (
                        <span className="ml-auto text-[10px] text-sidebar-foreground/80 tabular-nums shrink-0">{agent.chatCount}</span>
                      )}
                    </button>
                  )
                })}

                {!agentsQuery.isLoading && agents.length === 0 && (
                  <p className="px-3 py-2 text-xs text-sidebar-foreground/60 italic">No agents yet</p>
                )}
              </div>
            )}
          </div>

          {/* ── Chats Section ── */}
          <div className="pt-1">
            <div className="flex items-center justify-between px-3 py-1.5 group">
              <button
                onClick={() => setChatsOpen(!chatsOpen)}
                className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground hover:text-sidebar-foreground transition-colors uppercase tracking-wider"
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
                className="size-5 rounded flex items-center justify-center text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <PlusIcon className="size-3.5" />
              </button>
            </div>

            {chatsOpen && (
              <div className="space-y-0.5 pb-1">
                {/* New Chat always at top */}
                <button
                  onClick={() => handleNav("/dashboard")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
                >
                  <div className="size-5 rounded border border-dashed border-sidebar-border flex items-center justify-center shrink-0">
                    <PlusIcon className="size-3 text-sidebar-foreground" />
                  </div>
                  <span className="truncate">New Chat</span>
                </button>

                {chatsQuery.isLoading && (
                  <div className="px-3 py-2 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-3 rounded bg-sidebar-accent/50 animate-pulse" />
                    ))}
                  </div>
                )}

                {chats.map((chat) => {
                  const chatHref = `/dashboard?chatId=${chat.id}`
                  const isChatActive = pathname === "/dashboard" && currentChatId === chat.id
                  return (
                    <div key={chat.id} className="group relative flex items-center w-full">
                      <button
                        onClick={() => handleNav(chatHref)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 pr-9 rounded-lg text-sm transition-all duration-150 text-left",
                          isChatActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <MessageCircleIcon className="size-4 shrink-0 opacity-50" />
                        <span className="truncate flex-1">{chat.title}</span>
                      </button>

                      <div className={cn("absolute right-2 opacity-0 transition-opacity duration-150 z-20",
                        isMobile ? "opacity-100" : "group-hover:opacity-100"
                      )}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="size-6 rounded hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveChat(chat.id)
                              }}
                              className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}

                {!chatsQuery.isLoading && chats.length === 0 && (
                  <p className="px-3 py-2 text-xs text-sidebar-foreground/60 italic">No chats yet</p>
                )}
              </div>
            )}
          </div>
        </SidebarContent>

        {/* ── Footer: User info ── */}
        <SidebarFooter className="px-4 py-4 border-t border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground/90 truncate">{session?.user?.name}</p>
              <p className="text-[10px] text-sidebar-foreground/75 truncate">{session?.user?.email}</p>
            </div>
            <div>
              <ThemeToggle />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}