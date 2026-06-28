
import SplineScene from "@/components/spline";
import Preloader from "@/components/preloader";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Terminal,
  Menu
} from "lucide-react";
import Link from "next/link";
import MockDashboard from "./mock-dashboard";

const features = [
  {
    icon: Bot,
    title: "Custom Instructions",
    description:
      "Define exact guidelines, behavioral limits, personality traits, and format rules for each standalone helper.",
  },
  {
    icon: MessageSquare,
    title: "Focused Conversations",
    description:
      "Launch separate chat threads that retain memory contextual to the specific assistant and tasks you configure.",
  },
  {
    icon: Terminal,
    title: "Clean Interfaces",
    description:
      "Work inside a highly optimized environment featuring responsive card grids and clean dark dashboard layouts.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create an Agent",
    description:
      "Give it a name and highly specific instructions for a particular domain or task.",
  },
  {
    number: "2",
    title: "Start a Thread",
    description:
      "Initiate a new chat. The agent perfectly remembers its role and rules without repetition.",
  },
  {
    number: "3",
    title: "Iterate & Save",
    description:
      "Tweak instructions anytime. All future conversations will instantly adapt to the new rules.",
  },
];

const useCases = [
  { role: "Developers", desc: "Automate code reviews & boilerplate." },
  { role: "Designers", desc: "Generate assets and variations rapidly." },
  { role: "Founders", desc: "Scale operations without headcount." },
  { role: "Researchers", desc: "Synthesize papers and extract data." },
  { role: "Support", desc: "Resolve tickets with deep context." },
  { role: "Writers", desc: "Draft, edit, and ideate continuously." },
];

export default function Landing() {
  return (
    <>
      <Preloader />
      <main className="relative z-10 w-full overflow-hidden bg-black text-foreground">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full bg-black">
          {/* The Spline 3D Scene (Hidden on Mobile) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <SplineScene />
          </div>
        </section>

        {/* Dashboard Mockup Section */}
        <MockDashboard />

        {/* Features - Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto px-4 py-32 relative z-20">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-xs font-light tracking-[0.3em] text-white/50 mb-4 uppercase">
              Built for Focus
            </h2>
            <p className="text-white text-2xl md:text-4xl font-light tracking-wide max-w-2xl mx-auto">
              Everything you need without the noise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Large Box */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-2xl md:rounded-4xl p-4 md:p-8 border border-white/10 bg-black hover:bg-white/2 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="size-12 rounded-full mb-4 flex items-center justify-center border border-white/10 bg-black group-hover:border-white/30 transition-colors">
                    <Bot className="size-5 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg md:text-xl font-light tracking-wider text-white mb-4 uppercase">
                    Custom Instructions
                  </h3>
                  <p className="text-xs md:text-sm text-white/40 leading-relaxed font-light max-w-md">
                    Define exact guidelines, behavioral limits, personality traits, and format rules for each standalone helper.
                  </p>
                </div>
                {/* Mini UI visual */}
                <div className="mt-6 p-6 rounded-lg md:rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                   <div className="flex items-center space-x-3">
                     <div className="w-2 h-2 rounded-full bg-white/30"></div>
                     <div className="text-xs text-white/50 font-mono">system_prompt.txt</div>
                   </div>
                   <div className="text-xs text-white/30 font-mono tracking-tight leading-loose">
                     &gt; ALWAYS RESPOND IN MARKDOWN<br/>
                     &gt; NEVER APOLOGIZE<br/>
                     &gt; BE CONCISE
                   </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Small Box */}
            <div className="md:col-span-1 group relative overflow-hidden rounded-2xl md:rounded-4xl p-4 md:p-8 border border-white/10 bg-black hover:bg-white/[0.02] transition-colors duration-500">
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative z-10 flex flex-col h-full">
                  <div className="size-12 rounded-full mb-4 flex items-center justify-center border border-white/10 bg-black group-hover:border-white/30 transition-colors">
                    <MessageSquare className="size-5 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base md:text-lg font-light tracking-wider text-white mb-4 uppercase">
                    Focused Threads
                  </h3>
                  <p className="text-xs md:text-sm text-white/40 leading-relaxed font-light">
                    Launch separate chat threads that retain memory contextual to the specific assistant and tasks you configure.
                  </p>
                  <div className="mt-auto pt-12 flex space-x-[-10px]">
                     <div className="w-10 h-10 rounded-full border border-black bg-white/10"></div>
                     <div className="w-10 h-10 rounded-full border border-black bg-white/20"></div>
                     <div className="w-10 h-10 rounded-full border border-black bg-white/30"></div>
                  </div>
               </div>
            </div>

            {/* Feature 3: Full Width Box */}
            <div className="md:col-span-3 group relative overflow-hidden rounded-2xl md:rounded-4xl p-4 md:p-8 border border-white/10 bg-black hover:bg-white/[0.02] transition-colors duration-500 flex flex-col md:flex-row items-center gap-12">
               <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative z-10 flex-1">
                  <div className="size-12 rounded-full mb-4 flex items-center justify-center border border-white/10 bg-black group-hover:border-white/30 transition-colors">
                    <Terminal className="size-5 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg md:text-xl font-light tracking-wider text-white mb-2 uppercase">
                    Clean Interfaces
                  </h3>
                  <p className="text-xs md:text-sm text-white/40 leading-relaxed font-light max-w-md">
                    Work inside a highly optimized environment featuring responsive card grids and clean dark dashboard layouts designed for deep work.
                  </p>
               </div>
               <div className="relative z-10 flex-1 w-full flex justify-end">
                  <div className="w-full max-w-md h-40 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col gap-4">
                     <div className="flex gap-4">
                        <div className="flex-1 h-20 rounded-lg bg-white/5 border border-white/5"></div>
                        <div className="flex-1 h-20 rounded-lg bg-white/10 border border-white/10"></div>
                     </div>
                     <div className="w-full h-8 rounded-lg bg-white/5 border border-white/5"></div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* How It Works - Vertical Timeline */}
        <section id="how-it-works" className="relative max-w-7xl mx-4 md:mx-auto px-4 py-12 md:py-24">
          <div className="text-center mb-24 md:mb-40">
            <h2 className="text-xs font-light tracking-[0.3em] text-white/50 mb-4 uppercase">
              How Mono Works
            </h2>
            <p className="text-2xl md:text-4xl text-white max-w-2xl mx-auto font-light tracking-wide">
              Three simple steps to supercharge your workflow.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* The Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent transform md:-translate-x-1/2"></div>
            
            <div className="space-y-24 md:space-y-32">
              {steps.map((step, index) => (
                <div key={step.number} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 group ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                   
                   {/* Content Box */}
                   <div className={`flex-1 w-full pl-24 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                     <h3 className="text-lg md:text-xl font-light tracking-wider text-white mb-4 uppercase">
                       {step.title}
                     </h3>
                     <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed">
                       {step.description}
                     </p>
                   </div>

                   {/* Number Node */}
                   <div className="absolute left-0 md:static md:left-auto w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center text-sm font-light tracking-widest text-white/50 group-hover:border-white/50 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 z-10 shrink-0">
                     0{step.number}
                   </div>

                   {/* Empty space for alternate flex layout on desktop */}
                   <div className="hidden md:block flex-1 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases - Infinite Scroll */}
        <section className="w-full py-16 md:py-24 relative z-20 border-t border-white/5 overflow-hidden flex flex-col items-center">
          <h2 className="text-xs font-light tracking-[0.3em] text-white/50 mb-12 uppercase text-center relative z-20">
            Built for teams that move fast
          </h2>
          
          <div className="relative w-full flex overflow-hidden group z-0">
             {/* Gradient fade edges */}
             <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

             <div className="flex animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
                {[...useCases, ...useCases].map((useCase, idx) => (
                  <div key={idx} className="w-64 md:w-80 mx-3 md:mx-4 p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-3 shrink-0 hover:bg-white/[0.04] transition-colors cursor-default">
                     <p className="text-white uppercase tracking-widest text-xs font-medium">{useCase.role}</p>
                     <p className="text-white/40 text-xs md:text-sm font-light leading-relaxed">{useCase.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Advanced CTA Section */}
        <section
          id="pricing"
          className="w-full max-w-6xl mx-auto px-4 py-12 md:py-24 relative z-20"
        >
          <div className="relative group rounded-2xl md:rounded-4xl overflow-hidden bg-[#050505] border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/10">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
            
            {/* Subtle Simple Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:bg-white/5"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 py-12 md:p-16 gap-16">
              {/* Left Content */}
              <div className="flex-1 flex flex-col items-start text-left w-full max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">Just do it</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 tracking-tight leading-tight">
                  Stop doing <br className="hidden md:block"/> repetitive work.
                </h2>

                <p className="text-sm md:text-lg text-[#8e95a3] mb-10 md:mb-12 font-light leading-relaxed">
                  Spin up autonomous AI agents in seconds. Offload your tedious workflows and focus on what actually matters.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/sign-up"
                    className="group relative inline-flex w-full sm:w-auto h-10 md:h-12 items-center justify-center gap-3 rounded-full bg-white hover:bg-white/90 px-8 text-sm font-medium text-black"
                  >
                    <span>Start Building Free</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                  </Link>
                  
                  <Link
                    href="#how-it-works"
                    className="inline-flex w-full sm:w-auto h-10 md:h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-8 text-sm font-medium text-white transition-all hover:bg-white/[0.08]"
                  >
                    Book a Demo
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-white/30 text-xs font-light">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Enterprise grade security
                  </div>
                </div>
              </div>

              {/* Right Content - Visual */}
              <div className="flex-1 w-full relative hidden md:block">
                <div className="absolute inset-0 bg-white/[0.03] blur-3xl rounded-full"></div>
                <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 shadow-2xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-700">
                   {/* Window Controls */}
                   <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                     <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     <div className="w-3 h-3 rounded-full bg-white/20"></div>
                     <div className="ml-4 text-[10px] text-white/30 font-mono tracking-widest uppercase">agent-config.ts</div>
                   </div>
                   
                   {/* Mock Code */}
                   <div className="font-mono text-xs md:text-sm text-white/70 space-y-3 leading-loose">
                      <p><span className="text-purple-400">import</span> {`{ Agent }`} <span className="text-purple-400">from</span> <span className="text-emerald-400">'@mono/sdk'</span>;</p>
                      <br/>
                      <p><span className="text-purple-400">const</span> <span className="text-blue-400">supportAgent</span> = <span className="text-purple-400">new</span> <span className="text-yellow-200">Agent</span>({`{`}</p>
                      <p className="pl-4"><span className="text-white/50">name:</span> <span className="text-emerald-400">'Customer Support'</span>,</p>
                      <p className="pl-4"><span className="text-white/50">model:</span> <span className="text-emerald-400">'gemini-3.5-pro'</span>,</p>
                      <p className="pl-4"><span className="text-white/50">tools:</span> [zendesk, confluence],</p>
                      <p className="pl-4"><span className="text-white/50">instructions:</span> <span className="text-emerald-400">'Resolve tier 1 tickets automatically.'</span></p>
                      <p>{`});`}</p>
                      <br/>
                      <p><span className="text-blue-400">supportAgent</span>.<span className="text-yellow-200">deploy</span>();</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
