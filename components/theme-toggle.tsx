"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const onChange = () => {
    resolvedTheme == "dark" ? setTheme("light") : setTheme("dark")
  }

  return (
    <button
      onClick={() => onChange()}
      className="rounded-full"
      aria-label="Light Mode"
    >
      {resolvedTheme == "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
