import { Menu, MessageSquare } from "lucide-react"
import Image from "next/image"

const MockDashboard = () => {
    return (
        <section className="hidden sm:block relative w-full max-w-6xl mx-auto px-4 py-20 z-20">
            <div className="relative rounded-2xl md:rounded-4xl border border-white/7 bg-black/50 backdrop-blur-3xl overflow-hidden shadow-white/5">
                {/* Top Bar */}
                <div className="flex items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    </div>
                    <div className="mx-auto px-4 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/40 tracking-widest font-mono uppercase">
                        dashoard.mono.app
                    </div>
                </div>

                {/* Inner Dashboard Layout */}
                <div className="flex h-[400px] md:h-[600px] bg-[#0a0a0a]">
                    {/* Sidebar */}
                    <div className="hidden md:flex w-64 border-r border-white/5 bg-[#0f0f11] flex-col py-6 px-3">
                        {/* Logo */}
                        <div className="flex items-center px-3 mb-8 space-x-3">
                            <Image src='/logo.svg' width={30} height={30} alt="Logo" className="invert" /> 
                            <span className="text-white font-semibold tracking-wide">Mono</span>
                        </div>



                        {/* Agents Section */}
                        <div className="mb-6 px-1">
                            <div className="flex items-center justify-between px-3 text-[10px] font-bold text-white/30 tracking-wider mb-2">
                                <span>AGENTS</span>
                                <span className="text-white/50 text-base font-light leading-none">+</span>
                            </div>
                            <div className="space-y-[2px]">
                                <div className="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <span className="mr-3 text-lg font-light leading-none">+</span>
                                    <span className="text-sm">New Agent</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-5 rounded bg-blue-500/20 text-blue-400/30 flex items-center justify-center text-[10px]"></div>
                                        <span className="text-sm">Coding Agent</span>
                                    </div>
                                    <span className="text-xs text-white/20">2</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-5 rounded bg-emerald-500/20 text-emerald-400/30 flex items-center justify-center text-[10px]"></div>
                                        <span className="text-sm">Research Agent</span>
                                    </div>
                                    <span className="text-xs text-white/20">1</span>
                                </div>
                            </div>
                        </div>

                        {/* Chats Section */}
                        <div className="flex-1 px-1">
                            <div className="flex items-center justify-between px-3 text-[10px] font-bold text-white/30 tracking-wider mb-2">
                                <span>CHATS</span>
                                <span className="text-white/50 text-base font-light leading-none">+</span>
                            </div>
                            <div className="space-y-[2px]">
                                <div className="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <span className="mr-3 text-lg font-light leading-none">+</span>
                                    <span className="text-sm">New Chat</span>
                                </div>
                                <div className="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <MessageSquare className="size-4 mr-3 opacity-40" />
                                    <span className="text-sm truncate w-32">can u solve jee mains...</span>
                                </div>
                                <div className="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <MessageSquare className="size-4 mr-3 opacity-40" />
                                    <span className="text-sm truncate">Maths</span>
                                </div>
                                <div className="flex items-center px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <MessageSquare className="size-4 mr-3 opacity-40" />
                                    <span className="text-sm truncate">Timepass</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile */}
                        <div className="mt-auto px-4 pt-4 border-t border-white/5 flex items-center space-x-3">
                            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium">J</div>
                            <span className="text-xs text-white/50 truncate w-32">jacaerys@gmail.com</span>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 md:p-8 bg-[#0D0F12] flex flex-col items-center justify-center relative overflow-hidden select-none">
                        {/* Top Nav (Mobile menu / Profile right) */}
                        <div className="w-full flex justify-between md:justify-end mb-8 absolute top-4 right-4">
                            <div className="md:hidden size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                                <Menu size={18} />
                            </div>
                            <div className="size-9 rounded-full bg-muted hidden md:flex items-center justify-center border border-white/10 shadow-md shadow-purple-500/20">
                                <span className="text-[10px] text-white">J</span>
                            </div>
                        </div>

                        {/* Centered Content: Pill Input and Quick Start */}
                        <div className="flex flex-col items-center justify-center w-full max-w-xl z-10">
                            {/* Centered Pill Input */}
                            <div className="w-full max-w-md relative border border-white/5 backdrop-blur-md rounded-full bg-white/2 p-2 flex items-center justify-between mb-8 shadow-2xl">
                                <span className="text-white/30 text-sm select-none ml-3">Message Mono or type prompt...</span>
                                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>

                            {/* Quick Start Section */}
                            <div className="w-full max-w-md flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-5 px-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/30">Quick start with agents</h3>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                                    {/* Agent Card 1 */}
                                    <div className="group relative flex flex-col items-center justify-center w-[130px] p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] text-center transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-black/25 cursor-pointer">
                                        <div className="relative mb-3.5">
                                            <div className="size-11 rounded-full bg-blue-500/20 text-blue-400/30 flex items-center justify-center text-lg border border-white/5"></div>
                                            <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full border border-white/5 bg-black flex items-center justify-center">
                                                <span className="text-white/60 text-[8px] font-bold">+</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-white/90 truncate w-full group-hover:text-white transition-colors">Coding Agent</span>
                                        <span className="text-[10px] text-white/40 mt-1 font-medium">2 chats</span>
                                    </div>

                                    {/* Agent Card 2 */}
                                    <div className="group relative flex flex-col items-center justify-center w-[130px] p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] text-center transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-black/25 cursor-pointer">
                                        <div className="relative mb-3.5">
                                            <div className="size-11 rounded-full bg-emerald-500/20 text-emerald-400/30 flex items-center justify-center text-lg border border-white/5"></div>
                                            <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full border border-white/5 bg-black flex items-center justify-center">
                                                <span className="text-white/60 text-[8px] font-bold">+</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-white/90 truncate w-full group-hover:text-white transition-colors">Research Agent</span>
                                        <span className="text-[10px] text-white/40 mt-1 font-medium">1 chat</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Warning Notice */}
                            <p className="mt-8 text-center text-[10px] text-white/20 tracking-wide select-none">
                                Mono can make mistakes. Please check sensitive information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default MockDashboard