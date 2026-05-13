"use client"

import { LoaderIcon } from "lucide-react"

import { GenerateAvatarUri } from "@/lib/avatar"
import { useSession } from "@/lib/auth-client"
import { CallConnect } from "./call-connect"

interface Props {
    meetingId: string
    meetingName: string
}

export const CallProvider = ({meetingId, meetingName} : Props) => {
    const {data, isPending} = useSession()

    if (!data || isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white"/>
            </div>
        )
    }


    return (
        <div>
            <CallConnect
                meetingId={meetingId}
                meetingName={meetingName}
                userId={data.user.id}
                userName={data.user.name}
                userImage={data.user.image ?? GenerateAvatarUri({seed: data.user.name, variant: "initials"})}
            />
        </div>
    )
}