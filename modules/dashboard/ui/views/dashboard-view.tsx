"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRightIcon, BotIcon, MessageCircleIcon, MessageSquareTextIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState } from "@/components/error-state"
import { DashboardSkeleton } from "../components/dashboard-skeleton"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { useSession } from "@/lib/auth-client"
import { useTRPC } from "@/trpc/client"
import React, { memo, useMemo, useState, useEffect } from "react"

export const DashboardView = memo(function DashboardView() {
    const { data: session } = useSession()
    const trpc = useTRPC()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const { data: chatsData } = useQuery(trpc.chats.getMany.queryOptions({}))
    const { data: agentsData } = useQuery(trpc.agents.getMany.queryOptions({}))

    const totalChats = chatsData?.total ?? 0
    const totalAgents = agentsData?.total ?? 0
    const savedMessages = chatsData?.items.reduce((total, chat) => total + chat.messageCount, 0) ?? 0

    const stats = useMemo(() => [
        { title: "Agents", value: totalAgents, icon: BotIcon, tone: "text-primary" },
        { title: "Chats", value: totalChats, icon: MessageCircleIcon, tone: "text-chart-2" },
        { title: "Saved messages", value: savedMessages, icon: MessageSquareTextIcon, tone: "text-chart-3" },
    ], [totalAgents, totalChats, savedMessages])

    if (!mounted) {
        return <DashboardViewLoading />
    }

    return (
        <div className="bg-card/60 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 pb-24 md:px-8 md:py-8">
            <section className="rounded-lg border border-foreground/5 bg-card p-5 shadow-sm md:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            Welcome back, {session?.user.name?.split(" ")[0] || "there"}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Pick up a recent chat, create a new agent, or start a focused conversation from the same workspace.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button asChild className="rounded-full shadow-lg shadow-primary/10 transition-transform active:scale-95">
                            <Link href="/dashboard/chats">
                                <PlusIcon className="size-4" />
                                New chat
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full bg-muted/30! border-foreground/5! transition-transform active:scale-95">
                            <Link href="/dashboard/agents">
                                Manage agents
                                <ArrowUpRightIcon className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {stats.map(({ title, value, icon: Icon, tone }) => (
                    <Card key={title} className="group border border-foreground/5 bg-card shadow-sm transition-all hover:border-foreground/10 hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                            <Icon className={`size-5 ${tone} transition-transform group-hover:scale-110`} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-semibold">{value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="border border-foreground/5 bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Recent chats</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard/chats">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-foreground/5 overflow-hidden">
                            {(chatsData?.items ?? []).slice(0, 4).map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/dashboard/chats/${chat.id}`}
                                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-muted/60"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="size-2 rounded-full bg-primary/40 shrink-0" />
                                        <span className="truncate font-medium">{chat.title}</span>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 bg-muted/30 font-normal">{chat.messageCount} messages</Badge>
                                </Link>
                            ))}
                            {chatsData?.items.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
                                    <div className="rounded-full bg-muted p-4">
                                        <MessageCircleIcon className="size-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">No chats yet</p>
                                        <p className="text-sm text-muted-foreground">Start a conversation with one of your agents.</p>
                                    </div>
                                    <Button asChild size="sm" className="rounded-full">
                                        <Link href="/dashboard/chats">Start chatting</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-foreground/5 bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Top agents</CardTitle>
                        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard/agents">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(agentsData?.items ?? []).slice(0, 4).map((agent) => (
                            <Link
                                key={agent.id}
                                href={`/dashboard/agents/${agent.id}`}
                                className="flex items-center justify-between rounded-md border border-foreground/5 px-3 py-3 transition hover:bg-muted/60 hover:border-foreground/10"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-10 shadow-sm" />
                                    <span className="truncate font-medium">{agent.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Badge variant="secondary" className="shrink-0 bg-muted/50 font-normal text-xs">{agent.chatCount} chats</Badge>
                                     <ArrowUpRightIcon className="size-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                        {agentsData?.items.length === 0 && (
                             <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                                <div className="rounded-full bg-muted p-4">
                                    <BotIcon className="size-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">No agents created</p>
                                    <p className="text-sm text-muted-foreground">Create your first focused AI teammate.</p>
                                </div>
                                <Button asChild variant="outline" size="sm" className="rounded-full border-foreground/5 bg-muted/30!">
                                    <Link href="/dashboard/agents">Create agent</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
})

export const DashboardViewLoading = () => {
    return <DashboardSkeleton />
}

export const DashboardViewError = () => {
    return (
        <ErrorState
            title="Error"
            description="Please try again later"
        />
    )
}
