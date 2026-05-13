"use client"

import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { OctagonAlertIcon } from "lucide-react"
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
    email: z.string().email(),
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
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden border bg-card p-0 shadow-xl shadow-primary/5">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
                            <div className="text-center space-y-1">
                                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                                <p className="text-muted-foreground">Sign in to your Mono workspace</p>
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="elon@example.com" {...field} />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!!error && (
                                <Alert className="bg-destructive/10 border-none">
                                    <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}

                            <Button disabled={pending} type="submit" className="w-full">
                                Sign In
                            </Button>

                            <div className="relative text-center text-sm">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                    <span className="relative z-10 bg-card px-2 text-muted-foreground">OR</span>
                            </div>

                            <div className="grid grid-rows-2 gap-4">
                                <Button
                                    disabled={pending}
                                    variant="outline"
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3"
                                    onClick={() => onSocial('google')}
                                >
                                    <FaGoogle className="text-lg text-muted-foreground" />
                                    <span className="text-muted-foreground">Login with Google</span>
                                </Button>
                                <Button
                                    disabled={pending}
                                    variant="outline"
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3"
                                    onClick={() => onSocial('github')}
                                >
                                    <FaGithub className="text-lg text-muted-foreground" />
                                    <span className="text-muted-foreground">Login with GitHub</span>
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href="/sign-up" className="text-primary underline">
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </Form>

                    <div className="hidden flex-col justify-between border-l bg-muted/55 p-8 md:flex">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.svg" alt="Logo" width={44} height={44} className="dark:invert" style={{ width: 44, height: 44 }} />
                            <p className="text-xl font-semibold">Mono</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-3xl font-semibold tracking-tight">Return to your agents, chats, and meeting notes.</p>
                            <p className="text-sm leading-6 text-muted-foreground">
                                Keep every AI conversation organized around the assistant that knows the job.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline hover:text-primary">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </p>
        </div>
    )
}
