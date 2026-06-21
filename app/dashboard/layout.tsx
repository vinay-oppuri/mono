import { SidebarProvider } from "@/components/ui/sidebar"
import BottomNav from "@/modules/dashboard/ui/components/dashboard-bottom-nav"
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0D0F12]">
                <DashboardNavbar/>
                <div className="relative min-h-0 flex-1">
                    {children}
                </div>
                <BottomNav/>
            </main>
        </SidebarProvider>
    )
}

export default Layout
