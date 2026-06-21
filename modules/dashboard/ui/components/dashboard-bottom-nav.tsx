'use client'

import { Home, MessageCircleIcon, BotIcon } from "lucide-react"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/chats', icon: MessageCircleIcon, label: 'Chats' },
  { href: '/dashboard/agents', icon: BotIcon, label: 'Agents' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-white/[0.08] bg-[#0D0F12]/90 px-3 py-2 shadow-lg backdrop-blur-xl md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200"
            >
              <div
                className={cn(
                  'w-11 h-11 flex items-center justify-center rounded-full transition-all',
                  isActive
                    ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                    : 'bg-transparent text-[#8892b0]'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn("text-[10px]", isActive ? "text-[#8b5cf6]" : "text-[#8892b0]/60")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
