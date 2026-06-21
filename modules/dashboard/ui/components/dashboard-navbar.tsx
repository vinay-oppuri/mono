"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { MenuIcon } from "lucide-react"
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs"
import { DashboardUserButton } from "./dashboard-user-button"

export const DashboardNavbar = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#0D0F12] border-b border-white/[0.06] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          className="bg-white/[0.04]! border-white/[0.08]! hover:bg-white/[0.08]! text-white h-8 w-8 shrink-0"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
        >
          <MenuIcon size="14" />
        </Button>
        <DashboardBreadcrumbs />
      </div>
      <div className="flex items-center gap-3">
        <DashboardUserButton />
      </div>
    </nav>
  )
}
