"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"

const LABELS: Record<string, string> = {
  dashboard: "Home",
  chats: "Chats",
  agents: "Agents",
}

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s) ||
  /^[a-zA-Z0-9_-]{20,}$/.test(s)

export const DashboardBreadcrumbs = () => {
  const pathname = usePathname()
  const allSegments = pathname.split("/").filter(Boolean)

  // Filter out UUID segments but keep meaningful ones
  const segments = allSegments.filter((seg) => !isUUID(seg))

  const crumbs = segments.map((seg, index) => {
    const href = `/${allSegments.slice(0, allSegments.indexOf(seg, index) + 1).join("/")}`
    const label = LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1)
    const isLast = index === segments.length - 1
    return { href, label, isLast }
  })

  if (crumbs.length <= 1) return null

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="text-white/70">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} className="text-[#8892b0] hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
