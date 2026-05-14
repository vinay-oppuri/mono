"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  MessageCircleIcon, BotIcon, StarIcon, Sun, Moon,
  LayoutDashboardIcon
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { DashboardUserButton } from "./dashboard-user-button"
import { Button } from "@/components/ui/button"
import { DashboardTrial } from "./dashboard-trial"
import { useEffect, useState } from "react"

const firstSection = [
  { icon: LayoutDashboardIcon, label: "Dashboard", href: "/dashboard" },
  { icon: MessageCircleIcon, label: "Chats", href: "/dashboard/chats" },
  { icon: BotIcon, label: "Agents", href: "/dashboard/agents" }
]

const secondSection = [
  { icon: StarIcon, label: "Upgrade", href: "/dashboard/upgrade" },
]

export const DashboardSidebar = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isMobile, setOpenMobile } = useSidebar()


  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Sidebar className="border-r dark:border-none">
      <SidebarHeader className="flex items-center px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-3 py-4 -ml-8"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <Image src="/logo.svg" width={28} height={28} alt="Mono" className="dark:invert" />
          <span className="text-xl font-semibold tracking-tight text-foreground">Mono</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 rounded-md px-4 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      pathname === item.href && "bg-primary text-primary-foreground font-semibold hover:bg-primary hover:text-primary-foreground"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 rounded-md px-4 text-muted-foreground hover:bg-chart-3/10 hover:text-chart-3",
                      pathname === item.href && "bg-chart-3/12 text-chart-3 font-semibold"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="mt-4 flex items-center justify-between border-t border-border px-2 pt-4">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? <Sun className="text-foreground" /> : <Moon className="text-muted-foreground" />}
                </Button>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-foreground py-4">
        {!isMobile && <DashboardTrial />}
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  )
}