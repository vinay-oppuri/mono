"use client"

import { useEffect, useState } from 'react'
import { GeneratedAvatar } from '@/components/generated-avatar'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

import { authClient, signOut, useSession } from '@/lib/auth-client'
import { LogOutIcon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export const DashboardUserButton = () => {
    const { data, isPending } = useSession()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const onLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in')
                }
            }
        })
    }

    if (!mounted || isPending) {
        return <div className="size-10 rounded-full bg-muted animate-pulse shrink-0" />
    }

    if (!data?.user) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className='h-10 w-10 rounded-full border border-foreground/5! transition hover:bg-muted/30 outline-none shrink-0 p-0'
                >
                    {data.user.image ? (
                        <Avatar className='size-8 md:size-9'>
                            <AvatarImage src={data.user.image} alt={data.user.name} />
                            <AvatarFallback><User size={16} /></AvatarFallback>
                        </Avatar>
                    ) : (
                        <GeneratedAvatar
                            seed={data.user.name}
                            variant='initials'
                            className='size-10'
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' side='bottom' className='w-64 border-foreground/5! z-[100]'>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{data.user.name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{data.user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className='cursor-pointer flex items-center justify-between'>
                    Logout <LogOutIcon className='size-4' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
