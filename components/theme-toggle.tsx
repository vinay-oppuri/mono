"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed left-0 not-md:bottom-0 md:top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2 py-4 bg-background/60 backdrop-blur-md border border-foreground/5 border-l-0 rounded-r-2xl shadow-lg">
      <button 
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-all ${resolvedTheme === 'light' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-foreground/10 text-muted-foreground'}`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-all ${resolvedTheme === 'dark' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-foreground/10 text-muted-foreground'}`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
