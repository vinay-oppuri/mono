"use client"

import Link from "next/link"
import { memo, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRightIcon, BotIcon, MessageCircleIcon, MessageSquareTextIcon, PlusIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { useSession } from "@/lib/auth-client"
import { useFreeLimits } from "@/modules/premium/constants"
import { useTRPC } from "@/trpc/client"

export const DashboardView = memo(function DashboardView() {
    const { data: session } = useSession()
    const trpc = useTRPC()

    const { data: chatsData } = useQuery(trpc.chats.getMany.queryOptions({}))
    const { data: agentsData } = useQuery(trpc.agents.getMany.queryOptions({}))
    const { isFreeUser, chatLimit, agentLimit } = useFreeLimits()

    const totalChats = chatsData?.total ?? 0
    const totalAgents = agentsData?.total ?? 0
    const savedMessages = chatsData?.items.reduce((total, chat) => total + chat.messageCount, 0) ?? 0

    const stats = useMemo(() => [
        { title: "Agents", value: totalAgents, limit: agentLimit, icon: BotIcon, tone: "text-primary" },
        { title: "Chats", value: totalChats, limit: chatLimit, icon: MessageCircleIcon, tone: "text-chart-2" },
        { title: "Saved messages", value: savedMessages, limit: null, icon: MessageSquareTextIcon, tone: "text-chart-3" },
    ], [totalAgents, agentLimit, totalChats, chatLimit, savedMessages])

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-24 md:px-8 md:py-8">
            <section className="rounded-lg border bg-card p-5 shadow-sm md:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="mb-3 bg-muted/60">
                            {isFreeUser ? "Free workspace" : "Premium workspace"}
                        </Badge>
                        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            Welcome back, {session?.user.name || "there"}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Pick up a recent chat, create a new agent, or start a focused conversation from the same workspace.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button asChild className="rounded-full">
                            <Link href="/dashboard/chats">
                                <PlusIcon />
                                New chat
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/dashboard/agents">
                                Manage agents
                                <ArrowUpRightIcon />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stats.map(({ title, value, limit, icon: Icon, tone }) => (
                    <Card key={title} className="border bg-card shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                            <Icon className={`size-5 ${tone}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-semibold">{value}</p>
                                {limit !== null && isFreeUser ? (
                                    <p className="pb-1 text-sm text-muted-foreground">of {limit}</p>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent chats</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/chats">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y rounded-md border">
                            {(chatsData?.items ?? []).slice(0, 4).map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/dashboard/chats/${chat.id}`}
                                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-muted/60"
                                >
                                    <span className="truncate font-medium">{chat.title}</span>
                                    <Badge variant="outline" className="shrink-0">{chat.messageCount} messages</Badge>
                                </Link>
                            ))}
                            {chatsData?.items.length === 0 && (
                                <div className="flex items-center justify-between gap-3 px-4 py-4">
                                    <span className="text-sm text-muted-foreground">No chats yet</span>
                                    <Button asChild size="sm">
                                        <Link href="/dashboard/chats">Start</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Agents</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard/agents">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(agentsData?.items ?? []).slice(0, 4).map((agent) => (
                            <Link
                                key={agent.id}
                                href={`/dashboard/agents/${agent.id}`}
                                className="flex items-center justify-between rounded-md border px-3 py-3 transition hover:bg-muted/60"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate font-medium">{agent.name}</span>
                                </div>
                                <Badge variant="secondary" className="shrink-0">{agent.chatCount} chats</Badge>
                            </Link>
                        ))}
                        {agentsData?.items.length === 0 && (
                            <p className="rounded-md border px-4 py-4 text-sm text-muted-foreground">
                                Create an agent to start chatting.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
})

export const DashboardViewLoading = () => {
    return (
        <LoadingState
            title="Loading"
            description="This may take a few seconds"
        />
    )
}

export const DashboardViewError = () => {
    return (
        <ErrorState
            title="Error"
            description="Please try again later"
        />
    )
}
