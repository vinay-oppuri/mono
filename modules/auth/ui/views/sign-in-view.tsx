"use client"

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { OctagonAlertIcon, Sparkles } from "lucide-react"
import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from "next/link"
import Image from "next/image"

import { useState } from "react"
import { signIn } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: 'Password is required' })
})

export const SignInView = () => {
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null)
        setPending(true)

        signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/dashboard'
        }, {
            onSuccess: () => {
                setPending(false)
            },
            onError: ({ error }) => {
                setError(error.message)
                setPending(false)
            }
        })
    }

    const onSocial = (provider: 'github' | 'google') => {
        setError(null)
        setPending(true)

        signIn.social({
            provider: provider,
            callbackURL: '/dashboard'
        }, {
            onSuccess: () => {
                setPending(false)
            },
            onError: ({ error }) => {
                setError(error.message)
                setPending(false)
            }
        })
    }

    return (
        <div className="relative flex flex-col gap-6 select-none">
            <Card className="relative overflow-hidden border border-white/[0.08] bg-[#14171f]/50 backdrop-blur-xl p-0 shadow-2xl shadow-black/50 z-10 rounded-2xl">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-9">
                            <div className="text-center space-y-1.5">
                                <Link href="/" className="flex md:hidden items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity w-fit mx-auto cursor-pointer">
                                    <Image
                                        src="/logo.svg"
                                        alt="Logo"
                                        width={24}
                                        height={24}
                                        className="dark:invert shrink-0"
                                    />
                                    <span className="text-white font-bold text-sm tracking-tight">Mono</span>
                                </Link>
                                <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
                                <p className="text-sm text-[#8892b0]">Sign in to your Mono workspace</p>
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/80 font-semibold text-xs">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="elon@example.com" 
                                                    {...field} 
                                                    className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] focus:border-[#8b5cf6]/60 rounded-lg text-white" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-white/80 font-semibold text-xs">Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    {...field} 
                                                    className="bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12] focus:border-[#8b5cf6]/60 rounded-lg text-white" 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {!!error && (
                                <Alert className="bg-red-500/10 border border-red-500/25 rounded-lg py-2">
                                    <OctagonAlertIcon className="h-4 w-4 text-red-400 shrink-0" />
                                    <AlertTitle className="text-xs text-red-300 font-semibold ml-2">{error}</AlertTitle>
                                </Alert>
                            )}

                            <Button 
                                disabled={pending} 
                                type="submit" 
                                className="w-full h-10 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition-all font-semibold cursor-pointer shadow-lg shadow-[#8b5cf6]/20 border-none"
                            >
                                {pending ? "Signing in..." : "Sign In"}
                            </Button>

                            <div className="relative text-center text-xs">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/[0.06]" />
                                </div>
                                <span className="relative z-10 bg-[#161921] px-2 text-[#8892b0]/60 uppercase font-bold tracking-wider">OR</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    disabled={pending}
                                    variant="outline"
                                    type="button"
                                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] text-[#8892b0] hover:text-white transition-colors cursor-pointer"
                                    onClick={() => onSocial('google')}
                                >
                                    <FaGoogle className="text-sm shrink-0" />
                                    <span className="text-xs font-semibold">Google</span>
                                </Button>
                                <Button
                                    disabled={pending}
                                    variant="outline"
                                    type="button"
                                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] text-[#8892b0] hover:text-white transition-colors cursor-pointer"
                                    onClick={() => onSocial('github')}
                                >
                                    <FaGithub className="text-sm shrink-0" />
                                    <span className="text-xs font-semibold">GitHub</span>
                                </Button>
                            </div>

                            <p className="text-center text-xs text-[#8892b0]">
                                Don&apos;t have an account?{' '}
                                <Link href="/sign-up" className="text-white hover:underline font-bold transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </Form>

                    {/* Branding Side Panel */}
                    <div className="relative hidden md:flex flex-col justify-between border-l border-white/[0.08] bg-[#12151d] p-9 overflow-hidden">
                        <Link href="/" className="flex items-center gap-2.5 z-10 hover:opacity-80 transition-opacity w-fit cursor-pointer">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={28}
                                height={28}
                                className="dark:invert shrink-0"
                            />
                            <span className="text-white font-bold text-base tracking-tight">Mono</span>
                        </Link>
                        
                        <div className="space-y-4 z-10">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[10px] text-[#8892b0] shadow-inner w-fit">
                                <Sparkles className="size-3 text-white/70 animate-pulse" />
                                <span>Re-usable AI Agent Workspace</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                                Return to your AI Agents, chats, and workspace notes.
                            </h2>
                            <p className="text-xs leading-relaxed text-[#8892b0] max-w-sm">
                                Keep every AI conversation organized around the specific assistant configured for the job. Reconnect seamlessly.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-[10px] text-[#8892b0]/40 tracking-wide select-none">
                By signing in, you agree to our{' '}
                <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
            </p>
        </div>
    )
}
