"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRightIcon,
  BotIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { Navbar } from "./navbar"

const features = [
  {
    icon: BotIcon,
    title: "Role-specific agents",
    desc: "Create focused assistants for sales calls, planning, research, tutoring, or daily operations.",
  },
  {
    icon: MessageSquareTextIcon,
    title: "Chats that stay organized",
    desc: "Keep every conversation attached to the right agent so context stays easy to find.",
  },
  {
    icon: WorkflowIcon,
    title: "Meeting-ready workspace",
    desc: "Move from agents to chats and meetings without losing momentum or switching tools.",
  },
]

const workflow = [
  "Describe the agent's role and tone.",
  "Start a chat with the right context.",
  "Return to saved work whenever you need it.",
]

const faq = [
  { q: "Can I cancel my plan anytime?", a: "Yes. You can manage or cancel your subscription from the dashboard." },
  { q: "What does the yearly discount include?", a: "The yearly plan gives you 12 months of access for the price of 10." },
  { q: "Can I use Mono for different workflows?", a: "Yes. Each agent can have its own instructions, personality, and purpose." },
]

export const HomeView = () => {
  const [mounted, setMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const goToApp = () => {
    if (session) {
      router.push("/dashboard")
      return
    }

    setIsDialogOpen(true)
  }

  return (
    <>
      <SignInDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Navbar />

        <main className="pt-16">
          <section id="product" className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                <SparklesIcon className="size-4 text-primary" />
                AI agents for repeatable work
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Build a bench of AI agents that remember the work.
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Create custom agents, chat with them in dedicated workspaces, and keep every answer, draft, and decision easy to revisit.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={goToApp} size="lg" className="rounded-full px-6">
                  Create an agent
                  <ArrowRightIcon />
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                  <Link href="#workflow">See workflow</Link>
                </Button>
              </div>
              <div className="grid max-w-xl grid-cols-3 gap-3 border-t pt-5 text-sm">
                {["Private workspace", "Saved chats", "Fast setup"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2Icon className="size-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-lg border bg-card shadow-2xl shadow-primary/10">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-chart-4" />
                    <div className="size-2.5 rounded-full bg-chart-3" />
                    <div className="size-2.5 rounded-full bg-chart-2" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Agent workspace</span>
                </div>
                <div className="grid gap-0 md:grid-cols-[0.72fr_1fr]">
                  <div className="border-b bg-muted/40 p-4 md:border-b-0 md:border-r">
                    <div className="mb-4 flex items-center gap-3">
                      <Image
                        src="/agent.jpg"
                        alt="AI agent portrait"
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                        style={{ width: 48, height: 48 }}
                      />
                      <div>
                        <p className="font-medium">Strategy Agent</p>
                        <p className="text-xs text-muted-foreground">Planning, briefs, follow-ups</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {["Research brief", "Launch checklist", "Meeting recap"].map((item, index) => (
                        <div
                          key={item}
                          className={cn(
                            "rounded-md border px-3 py-2",
                            index === 0 ? "bg-card text-foreground" : "bg-background/60 text-muted-foreground"
                          )}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
                      Help me turn these customer notes into a sharper weekly plan.
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                        <BrainCircuitIcon className="size-4 text-primary" />
                        Recommended next steps
                      </div>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li>Prioritize the three account risks by revenue impact.</li>
                        <li>Draft one follow-up message for each customer segment.</li>
                        <li>Prepare a 15-minute agenda for the sales sync.</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md border p-3">
                        <p className="text-2xl font-semibold">24</p>
                        <p className="text-xs text-muted-foreground">Saved chats</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <p className="text-2xl font-semibold">8</p>
                        <p className="text-xs text-muted-foreground">Active agents</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-background p-5">
                <feature.icon className="mb-4 size-5 text-primary" />
                <h2 className="mb-2 text-base font-semibold">{feature.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </section>

          <section id="workflow" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">Workflow</p>
              <h2 className="text-3xl font-semibold tracking-tight text-balance">From a blank idea to a reusable teammate in minutes.</h2>
            </div>
            <div className="space-y-3">
              {workflow.map((item, index) => (
                <div key={item} className="flex items-start gap-4 rounded-lg border bg-card p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <ShieldCheckIcon className="size-6 text-primary" />
              <h2 className="text-2xl font-semibold">Questions before you start</h2>
            </div>
            <div className="divide-y rounded-lg border bg-card">
              {faq.map((item) => (
                <div key={item.q} className="p-5">
                  <h3 className="font-medium">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
