import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { Suspense } from "react"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <Suspense fallback={<div className="w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar" />}>
                <DashboardSidebar />
            </Suspense>
            <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
                <DashboardNavbar />
                <div className="relative min-h-0 flex-1 flex flex-col">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default Layout
