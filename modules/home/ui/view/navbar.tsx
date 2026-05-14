"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LogIn, MoonIcon, SunIcon, MenuIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"
import { useSession } from "@/lib/auth-client"

const navItems = [
  { label: "Product", href: "#product" },
  { label: "What We Offer", href: "#product" },
  { label: "Pricing", href: "/dashboard/upgrade" },
  { label: "FAQ", href: "#faq" },
]

export const Navbar = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const goToApp = () => {
    setIsOpen(false)
    if (session) {
      router.push("/dashboard")
      return
    }

    setIsDialogOpen(true)
  }

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <>
      <SignInDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm px-2 py-2 lg:py-4">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" height={34} width={34} alt="Mono" priority className="dark:invert" style={{ width: 34, height: 34 }} />
            <span className="text-lg font-semibold tracking-tight">Mono</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border bg-card/70 p-1 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={goToApp} className="hidden rounded-full px-5 sm:inline-flex">
              <LogIn /> Start free
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden rounded-full md:inline-flex"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon className="text-foreground" /> : <MoonIcon className="text-muted-foreground" />}
            </Button>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-x-0 top-20 z-40 px-4 md:hidden">
          <div className="mx-auto max-w-lg rounded-2xl border border-white/5 bg-background/95 p-5 shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="flex w-full p-4 text-sm font-medium text-slate-300 transition-all hover:text-white hover:bg-white/5 rounded-2xl text-left"
                >
                  {item.label}
                </button>
              ))}

              <Button
                onClick={() => goToApp()}
                className="mt-4 flex w-full items-center gap-4 bg-primary px-4 py-4 text-sm font-medium text-background transition-all rounded-full shadow-inner"
              >
                <LogIn className="h-6 w-6" /> Start free
              </Button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
