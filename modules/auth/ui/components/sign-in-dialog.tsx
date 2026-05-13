import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import React from 'react'
import { signIn } from "@/lib/auth-client"
import { FaGoogle, FaGithub } from 'react-icons/fa'
import Link from 'next/link'


interface SignInDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const SignInDialog = ({
    open,
    onOpenChange
}: SignInDialogProps) => {

    const onSocial = async (provider: 'github' | 'google') => {
        await signIn.social({
            provider,
            callbackURL: '/dashboard'
        })
    }

    return (
        <ResponsiveDialog
            title=""
            description=""
            open={open}
            onOpenChange={onOpenChange}
            className="w-full max-w-sm md:max-w-[400px]"
        >
            <div className="flex flex-col items-center gap-6 w-full p-2 md:-mt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mt-2">
                        Welcome back
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full relative h-12 rounded-xl text-base font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 border-border"
                        onClick={() => onSocial('google')}
                    >
                        <FaGoogle className="mr-3 text-lg" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-12 rounded-xl text-base font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 border-border"
                        onClick={() => onSocial('github')}
                    >
                        <FaGithub className="mr-3 text-lg" />
                        Continue with GitHub
                    </Button>
                </div>

                <div className="relative w-full text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <span className="relative z-10 bg-background px-3 text-xs uppercase text-muted-foreground font-medium tracking-wider">
                        Or
                    </span>
                </div>
                <Link
                    href="/sign-up"
                    className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                    onClick={() => onOpenChange(false)}
                >
                    Create an account
                </Link>
            </div>
        </ResponsiveDialog>
    )
}

export default SignInDialog
