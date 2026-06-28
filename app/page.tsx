import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Navbar from "@/modules/home/ui/components/home-navbar"
import Landing from "@/modules/home/ui/components/home-landing"
import Footer from "@/modules/home/ui/components/home-footer"
import HomeClientWrapper from "@/modules/home/ui/components/home-client-wrapper"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // If user is already authenticated, redirect to /dashboard
  if (session) {
    redirect("/dashboard")
  }

  // Otherwise render a premium landing page
  return (
    <div className="relative min-h-screen text-foreground flex flex-col justify-between overflow-x-hidden">
      <HomeClientWrapper>
        {/* ── Top Header Navigation ── */}
        <Navbar />

        {/* ── Hero Section ── */}
        <Landing />

        {/* ── Footer ── */}
        <Footer />
      </HomeClientWrapper>
    </div>
  )
}