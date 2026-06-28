import { Menu, MessageSquare } from "lucide-react"
import Image from "next/image"

const MockDashboard = () => {
    return (
        <section className="hidden sm:block relative w-full max-w-6xl mx-auto px-4 py-20 z-20">
            <div className="relative rounded-2xl border border-white/7 bg-black/50 backdrop-blur-3xl overflow-hidden shadow-white/5">
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

                        {/* Navigation */}
                        <div className="px-1 mb-6">
                            <div className="flex items-center space-x-3 px-3 py-2.5 bg-white/10 rounded-xl text-white shadow-sm">
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span className="text-sm font-medium">Home</span>
                            </div>
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
                                        <div className="size-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">🤖</div>
                                        <span className="text-sm">Coding Agent</span>
                                    </div>
                                    <span className="text-xs text-white/20">2</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">👽</div>
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
                    <div className="flex-1 p-6 md:p-8 bg-[#0a0a0a] flex flex-col justify-items items-center relative overflow-hidden">
                        {/* Top Nav (Mobile menu / Profile right) */}
                        <div className="w-full flex justify-between md:justify-end mb-8 absolute top-4 right-4">
                            <div className="md:hidden size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                                <Menu size={18} />
                            </div>
                            <div className="size-9 rounded-full bg-muted hidden md:flex items-center justify-center border border-white/10 shadow-md shadow-purple-500/20">
                                <span className="text-[10px] text-white">J</span>
                            </div>
                        </div>

                        {/* Center Content */}
                        <div className="flex-1 flex flex-col items-center justify-center -mt-16 absolute top-32"> 
                            <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">Good afternoon, Jace</h1>
                            <p className="text-[#8e95a3] text-center text-sm max-w-lg leading-relaxed mb-16">
                                Choose an agent or ask Mono to pick the best companion for your task.
                            </p>

                            {/* Quick Start */}
                            <div className="w-full max-w-3xl px-4 md:px-0">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-bold text-white/30 tracking-wider">QUICK START WITH AGENTS</span>
                                    <span className="text-[10px] font-medium cursor-pointer transition-colors">View all</span>
                                </div>
                                <div className="flex justify-center space-x-4 md:space-x-6">
                                    {/* Agent Card 1 */}
                                    <div className="w-32 h-32 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center cursor-pointer transition-colors">
                                        <div className="size-9 rounded-full bg-black mb-4 flex items-center justify-center text-white/50 text-xl font-light shadow-xl border border-white/5">+</div>
                                        <span className="text-white font-medium text-sm">Coding Agent</span>
                                        <span className="text-white/30 text-xs mt-1">2 chats</span>
                                    </div>
                                    {/* Agent Card 2 */}
                                    <div className="w-32 h-32 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col items-center justify-center cursor-pointer transition-colors">
                                        <div className="size-9 rounded-full bg-black mb-4 flex items-center justify-center text-white/50 text-xl font-light shadow-xl border border-white/5">+</div>
                                        <span className="text-white font-medium text-sm">Research Agent</span>
                                        <span className="text-white/30 text-xs mt-1">1 chat</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Input Area */}
                        <div className="absolute bottom-2 w-full max-w-3xl mx-auto">
                            <div className="relative rounded-2xl border border-white/5 bg-muted/30 p-4 flex flex-col shadow-2xl">
                                <input
                                    type="text"
                                    disabled
                                    placeholder="Message Mono or type prompt..."
                                    className="w-full border-none text-white placeholder-white/30 outline-none text-sm mb-4 px-2"
                                />
                                <div className="flex justify-between items-center">
                                    <div className="px-3 py-1.5 rounded-lg border border-white/2 bg-white/3 text-xs text-white/60 flex items-center space-x-2 cursor-pointer hover:bg-white/[0.05] transition-colors">
                                        <span>Gemini Assistant</span>
                                        <span className="text-[10px] opacity-50 ml-1">▼</span>
                                    </div>
                                    <div className="size-7 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-center text-white/50 transition-colors">
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-white/30 mt-4 mb-2">
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