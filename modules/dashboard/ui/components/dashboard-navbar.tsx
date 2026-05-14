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

      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between bg-sidebar border-b dark:border-none px-4 backdrop-blur-sm md:px-6">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          {/* Desktop: Search bar + Menu button */}
          <Button
            className="hidden md:flex bg-muted/40! border-foreground/5!"
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
          >
            <MenuIcon size="16" />
          </Button>

          <Button
            onClick={() => setCommandOpen((open) => !open)}
            variant="outline"
            size="sm"
            className="hidden h-9 w-72 justify-start rounded-full bg-muted/40! border-foreground/5! text-muted-foreground md:flex"
          >
            <SearchIcon className="mr-2" size="16" /> Search
          </Button>

          {/* Mobile: Logo */}
          <Link href='/' className="md:hidden relative cursor-pointer">
            <Image
              src="/logo.svg"
              height={32}
              width={32}
              alt="Mono"
              className="dark:invert ml-2 md:ml-0"
            />

          </Link>

          <Link href='/' className="md:hidden text-lg font-semibold">Mono</Link>
        </div>

        {/* RIGHT SECTION (Only on Mobile) */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            onClick={() => setCommandOpen((open) => !open)}
            variant="ghost"
            size="sm"
            className="flex h-9 w-30 justify-start rounded-full border bg-muted/45 font-normal text-muted-foreground"
          >
            <SearchIcon className="mr-2" size="16" /> Search
          </Button>

          <Button
            variant="ghost"
            className="size-9"
            onClick={toggleSidebar}
          >
            <MenuIcon size="16" />
          </Button>
        </div>
      </nav>
    </>
  )
}
