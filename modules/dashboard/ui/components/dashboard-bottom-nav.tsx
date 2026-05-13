'use client'

import { Home, MessageCircleIcon, BotIcon, LayoutDashboardIcon, StarIcon } from "lucide-react"
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', icon: Home },
  { href: '/dashboard/agents', icon: BotIcon },
  { href: '/dashboard/upgrade', icon: StarIcon },
  { href: '/dashboard/chats', icon: MessageCircleIcon },
  { href: '/dashboard', icon: LayoutDashboardIcon },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-full border bg-background/90 px-3 py-2 shadow-lg backdrop-blur-xl md:hidden">
      <div className="flex justify-between items-center">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center text-xs transition-all duration-200"
            >
              <div
                className={cn(
                  'w-11 h-11 flex items-center justify-center rounded-full transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-transparent text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5"/>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
