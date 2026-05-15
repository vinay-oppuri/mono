"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import {
  MenuIcon,
  SearchIcon
} from "lucide-react"
import { DashboardCommand } from "./dashboard-command"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs"
import { DashboardUserButton } from "./dashboard-user-button"

export const DashboardNavbar = () => {
  const { toggleSidebar } = useSidebar()
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between bg-sidebar border-b dark:border-none px-2 backdrop-blur-sm md:px-6">    
        {/* LEFT GROUP */}
        <div className="flex items-center gap-4">
          {/* Desktop Toggle + Breadcrumbs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              className="bg-muted/40! border-foreground/5!"
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
            >
              <MenuIcon size="16" />
            </Button>
            <DashboardBreadcrumbs />
          </div>

          {/* Mobile Logo Group */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/" className="relative cursor-pointer ml-2">
              <Image
                src="/logo.svg"
                height={32}
                width={32}
                alt="Mono"
                className="dark:invert"
              />
            </Link>
            <Link href="/" className="text-lg font-semibold">Mono</Link>
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="flex items-center gap-3">
          {/* Desktop Search + User */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => setCommandOpen((open) => !open)}
              variant="outline"
              size="sm"
              className="h-9 w-64 justify-start rounded-full bg-muted/40! border-foreground/5! text-muted-foreground"
            >
              <SearchIcon className="mr-2" size="16" /> Search
            </Button>
            <DashboardUserButton />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              onClick={() => setCommandOpen((open) => !open)}
              variant="ghost"
              size="icon"
              className="size-9 rounded-full bg-none!"
            >
              <SearchIcon />
            </Button>
            <DashboardUserButton />
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={toggleSidebar}
            >
              <MenuIcon size="16" />
            </Button>
          </div>
        </div>
      </nav>
    </>
  )
}
