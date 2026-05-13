'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, HomeIcon, BadgeCheckIcon, WalletIcon, HelpCircleIcon, MenuIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Home", href: "#", icon: <HomeIcon className="h-5 w-5" /> },
    { name: "Features", href: "#features", icon: <BadgeCheckIcon className="h-5 w-5" /> },
    { name: "Pricing", href: "/dashboard/upgrade", icon: <WalletIcon className="h-5 w-5" /> },
    { name: "FAQ", href: "#faq", icon: <HelpCircleIcon className="h-5 w-5" /> },
]

export const Sidebar = () => {
    const [open, setOpen] = useState(false)
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    const handleClick = () => setOpen(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MenuIcon size="16"/>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[235px] p-3 bg-sidebar/80 backdrop-blur-xs text-foreground shadow-xl">

                <Link href="/" className="flex items-center gap-3 px-7 py-5" onClick={handleClick}>
                    <div className="relative">
                        <Image src="/logo.svg" width={36} height={36} alt="Mono" className="dark:invert" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Mono</span>

                </Link>

                {/* Navigation */}
                <nav className="flex flex-col gap-3">
                    {navItems.map((item) => {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleClick}
                                className={cn(
                                    "flex items-center w-full h-10 gap-3 px-4 rounded-lg text-sidebar-foreground text-sm transition-all hover:bg-white/10",
                                )}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Theme Toggle */}
                <div className="mt-8 px-1 pt-6 border-t flex items-center justify-between text-sidebar-foreground">
                    <span className="text-sm font-medium">Theme</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

