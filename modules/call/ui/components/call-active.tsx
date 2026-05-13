import Link from "next/link";
import Image from "next/image";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { CallControls, SpeakerLayout, useCall } from "@stream-io/video-react-sdk";
import { useEffect } from "react";

interface Props {
    onLeave: () => void
    meetingName: string
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    const call = useCall()
    const trpc = useTRPC()

    const { mutate: joinAgent } = useMutation(
        trpc.meetings.joinAgent.mutationOptions()
    )

    useEffect(() => {
        // Voice Agent disabled as Stream SDK only supports OpenAI Realtime.
        // Gemini Chat is still active via webhooks.
        /*
        if (!call?.id) return

        joinAgent({ meetingId: call.id })
        */
    }, [call?.id, joinAgent])


    return (
        <div className="flex flex-col justify-between h-full p-4 text-white">
            <div className="bg-secondary/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <Link href='/dashboard' className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src='/logo.svg' alt="Meet.AI" width={40} height={40} />
                </Link>
                <h4>{meetingName}</h4>
            </div>
            <SpeakerLayout />
            <div className="bg-secondary/50 backdrop-blur-md border border-white/10 rounded-2xl px-4">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    )
}