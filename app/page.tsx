import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Navbar from "@/modules/home/ui/components/home-navbar"
import Landing from "@/modules/home/ui/components/home-landing"
import Footer from "@/modules/home/ui/components/home-footer"
import PlanetBackground from "@/components/3js-background"
import Preloader from "@/components/preloader"

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
    <div className="relative min-h-screen text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#8b5cf6]/30 selection:text-white">
      {/* ── Top Header Navigation ── */}
      <Preloader />
      <PlanetBackground />
      <Navbar />

      {/* ── Hero Section ── */}
      <Landing />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}