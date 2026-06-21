import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Bot, MessageSquare, Terminal, ArrowRight } from "lucide-react"
import Navbar from "@/modules/home/ui/components/home-navbar"
import Landing from "@/modules/home/ui/components/home-landing"
import Footer from "@/modules/home/ui/components/home-footer"
import VeoBackground from "@/components/VeoBackground"

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
      {/* <VeoBackground /> */}
      <Navbar />

      {/* ── Hero Section ── */}
      <Landing />

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}