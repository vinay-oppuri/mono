"use client"

import React, { useRef, useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  isPending?: boolean
  selectedAgent?: { name: string } | null
  onDeselectAgent?: () => void
  className?: string
  maxHeight?: number
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Message Mono or type prompt...",
  disabled = false,
  isPending = false,
  selectedAgent = null,
  onDeselectAgent,
  className,
  maxHeight = 200,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isMultiline, setIsMultiline] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const sh = el.scrollHeight
    el.style.height = Math.min(sh, maxHeight) + "px"
    setIsMultiline(sh > 56 || value.includes("\n"))
  }, [value, maxHeight])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled && !isPending) {
        onSend()
      }
    }
  }

  const handleSendClick = () => {
    if (value.trim() && !disabled && !isPending) {
      onSend()
    }
  }

  const isSubmitDisabled = !value.trim() || disabled || isPending

  return (
    <div
      className={cn(
        "w-full relative border border-border backdrop-blur-md shadow-lg shadow-black/10 transition-all duration-200 focus-within:border-white/[0.15] focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.2)] bg-card/80",
        (selectedAgent || isMultiline) ? "rounded-2xl" : "rounded-full",
        className
      )}
    >
      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled || isPending}
        className={cn(
          "ml-2 w-full resize-none border-none! bg-transparent! px-5! py-4! placeholder:text-muted-foreground! focus:outline-none! focus-visible:ring-transparent! text-xs md:text-sm leading-relaxed text-foreground!",
          selectedAgent ? "pb-2! pr-5!" : "pr-14! min-h-[56px]!"
        )}
      />

      {/* Bottom toolbar or absolute button based on selectedAgent */}
      {selectedAgent ? (
        <div className="flex items-center justify-between px-3.5 pb-3">
          {/* Left: Selected agent preview */}
          {onDeselectAgent ? (
            <button
              type="button"
              onClick={onDeselectAgent}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 border bg-ring/10 border-ring/25 text-ring hover:bg-ring/25 select-none cursor-pointer"
            >
              <GeneratedAvatar seed={selectedAgent.name} variant="botttsNeutral" className="size-4" />
              <span className="max-w-[120px] truncate">{selectedAgent.name}</span>
              <span className="text-[10px] opacity-60 ml-1">x</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 border border-border px-2.5 py-1 text-[11px] text-muted-foreground select-none">
              <GeneratedAvatar seed={selectedAgent.name} variant="botttsNeutral" className="size-3.5" />
              <span className="font-semibold text-foreground/80">{selectedAgent.name}</span>
            </div>
          )}

          {/* Right: Send button with professional accent */}
          <button
            type="button"
            onClick={handleSendClick}
            disabled={isSubmitDisabled}
            className={cn(
              "flex items-center justify-center size-9 rounded-full transition-all duration-150 shrink-0 ml-auto",
              !isSubmitDisabled
                ? "bg-ring text-white shadow-lg shadow-ring/20 cursor-pointer"
                : "bg-foreground/5 text-foreground/60 cursor-not-allowed border border-foreground/5"
            )}
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSendClick}
          disabled={isSubmitDisabled}
          className={cn(
            "absolute right-2.5 bottom-2.5 flex items-center justify-center size-9 rounded-full transition-all duration-150 shrink-0",
            !isSubmitDisabled
              ? "bg-ring text-white shadow-lg shadow-ring/20 cursor-pointer"
              : "bg-foreground/5 text-foreground/60 cursor-not-allowed border border-foreground/5"
          )}
        >
          <ArrowUp className="size-4" />
        </button>
      )}
    </div>
  )
}
