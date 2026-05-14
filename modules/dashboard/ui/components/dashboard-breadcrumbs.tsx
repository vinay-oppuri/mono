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

export const DashboardBreadcrumbs = () => {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb className="hidden lg:block ml-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {paths.length > 1 && <BreadcrumbSeparator />}

        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.length - 2
          const href = `/${paths.slice(0, index + 2).join("/")}`
          const label = path.charAt(0).toUpperCase() + path.slice(1)

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
