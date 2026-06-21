import { ArrowRight, Bot, MessageSquare, Terminal } from "lucide-react"
import Link from "next/link"

const Landing = () =>  {
    return (
        <main className="flex-1 flex flex-col items-center justify-center min-h-screen z-10 py-20 px-4 mt-24 md:mt-32">
        <div className="max-w-3xl w-full text-center flex flex-col items-center">

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Re-usable <span className="text-[#8b5cf6]">AI Agents</span><br />
            tailored for your workflow.
          </h1>

          {/* Paragraph */}
          <p className="text-sm md:text-md text-white max-w-xl mx-auto leading-relaxed mb-10">
            Construct focused AI assistants with custom behavioral rules. Turn repeated prompts into standalone, reusable agents that save hours of repeated instructions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-24 justify-center">
            <Link
              href="/sign-up"
              className="h-11 px-8 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white hover:brightness-110 active:scale-[0.98] transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#8b5cf6]/20 hover:shadow-[#8b5cf6]/40 hover:-translate-y-0.5 text-xs md:text-sm"
            >
              <span>Build First Agent</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sign-in"
              className="h-11 px-8 rounded-full bg-background/40 border border-white/10 text-white transition-all duration-300 font-bold flex items-center justify-center text-xs md:text-sm hover:-translate-y-0.5 shadow-lg shadow-black/20"
            >
              Enter Workspace
            </Link>
          </div>

          {/* Features Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left mb-32 -mt-8 relative z-10 px-2">
            <div className="group bg-background/80 p-8 rounded-3xl border border-white/5 hover:border-[#8b5cf6]/30 hover:bg-background hover:shadow-2xl hover:shadow-[#8b5cf6]/10 transition-all duration-500">
              <div className="size-12 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white mb-6 group-hover:scale-110 group-hover:bg-[#8b5cf6] transition-all duration-300 shrink-0">
                <Bot className="size-6 text-[#8b5cf6] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white mb-3">Custom Instructions</h3>
              <p className="text-xs md:text-sm text-[#8892b0] leading-relaxed">
                Define exact guidelines, behavioral limits, personality traits, and format rules for each standalone helper.
              </p>
            </div>

            <div className="group p-8 rounded-3xl border border-white/[0.06] bg-background/80 hover:border-[#8b5cf6]/30 hover:bg-background hover:shadow-2xl hover:shadow-[#8b5cf6]/10 transition-all duration-500">
              <div className="size-12 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white mb-6 group-hover:scale-110 group-hover:bg-[#8b5cf6] transition-all duration-300 shrink-0">
                <MessageSquare className="size-6 text-[#8b5cf6] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white mb-3">Focused Conversations</h3>
              <p className="text-xs md:text-sm text-[#8892b0] leading-relaxed">
                Launch separate chat threads that retain memory contextual to the specific assistant and tasks you configure.
              </p>
            </div>

            <div className="group p-8 rounded-3xl border border-white/[0.06] bg-background/80 hover:border-[#8b5cf6]/30 hover:bg-background hover:shadow-2xl hover:shadow-[#8b5cf6]/10 transition-all duration-500">
              <div className="size-12 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white mb-6 group-hover:scale-110 group-hover:bg-[#8b5cf6] transition-all duration-300 shrink-0">
                <Terminal className="size-6 text-[#8b5cf6] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-sm md:text-lg font-bold text-white mb-3">Clean Interfaces</h3>
              <p className="text-xs md:text-sm text-[#8892b0] leading-relaxed">
                Work inside a highly optimized environment featuring responsive card grids and clean dark dashboard layouts.
              </p>
            </div>
          </div>

          {/* How it Works Section */}
          <section id="how-it-works" className="w-full max-w-5xl px-2 py-20 border-t border-white/[0.04]">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">How Mono Works</h2>
              <p className="text-xs md:text-sm text-[#8892b0] max-w-xl mx-auto">Three simple steps to supercharge your daily workflow with specialized AI assistants.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 text-center">
                <div className="text-6xl font-black text-[#8b5cf6]/10 absolute top-0 left-1/2 -translate-x-1/2 select-none z-0">1</div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-sm md:text-xl font-bold text-white mb-2">Create an Agent</h3>
                  <p className="text-xs md:text-sm text-[#8892b0]">Give it a name and highly specific instructions for a particular domain or task.</p>
                </div>
              </div>
              <div className="relative p-6 text-center">
                <div className="text-6xl font-black text-[#8b5cf6]/10 absolute top-0 left-1/2 -translate-x-1/2 select-none z-0">2</div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-sm md:text-xl font-bold text-white mb-2">Start a Thread</h3>
                  <p className="text-xs md:text-sm text-[#8892b0]">Initiate a new chat. The agent perfectly remembers its role and rules without repetition.</p>
                </div>
              </div>
              <div className="relative p-6 text-center">
                <div className="text-6xl font-black text-[#8b5cf6]/10 absolute top-0 left-1/2 -translate-x-1/2 select-none z-0">3</div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-sm md:text-xl font-bold text-white mb-2">Iterate & Save</h3>
                  <p className="text-xs md:text-sm text-[#8892b0]">Tweak instructions anytime. All future conversations will instantly adapt to the new rules.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Simple CTA / Pricing Banner */}
          <section id="pricing" className="w-full max-w-4xl py-20">
            <div className="rounded-3xl border border-[#8b5cf6]/30 p-10 md:p-14 text-center relative overflow-hidden">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 relative z-10">Start building for free</h2>
              <p className="text-xs md:text-sm text-[#8892b0] mb-8 max-w-lg mx-auto relative z-10">
                Join thousands of developers and professionals saving hours every week with reusable, specialized AI agents.
              </p>
              <Link
                href="/sign-up"
                className="text-xs md:text-sm inline-flex h-9 px-8 rounded-full bg-white text-[#0D0F12] hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold items-center justify-center shadow-xl shadow-white/10 relative z-10"
              >
                Get Started Now
              </Link>
            </div>
          </section>

        </div>
      </main>
    )
}
export default Landing