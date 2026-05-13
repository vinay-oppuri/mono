import Link from "next/link";
import { RocketIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { MAX_FREE_AGENTS, MAX_FREE_CHATS } from "@/modules/premium/constants";

export const DashboardTrial = () => {
    const trpc = useTRPC()
    const {data} = useQuery(trpc.premium.getFreeUsage.queryOptions())

    if(!data) return null

    return (
        <div className="flex flex-col gap-y-2 text-muted-foreground border border-border/10 rounded-lg w-full bg-white/5">
            <div className="flex flex-col p-3 gap-y-4">
                <div className="flex items-center gap-2">
                    <RocketIcon className="size-4"/>
                    <p className="text-sm font-medium">Free Trial</p>
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {data.agentCount}/{MAX_FREE_AGENTS}
                    </p>
                    <Progress value={(data.agentCount / MAX_FREE_AGENTS) * 100}/>
                </div>
                <div className="flex flex-col gap-y-2">
                    <p className="text-xs">
                        {data.chatCount}/{MAX_FREE_CHATS}
                    </p>
                    <Progress value={(data.chatCount / MAX_FREE_CHATS) * 100}/>
                </div>
            </div>
            <Button asChild className="bg-transparent text-white border-t border-border/10 hover:bg-white/10 rounded-t-none">
                <Link href='/dashboard/upgrade'>Upgrade</Link>
            </Button>
        </div>
    )
}
