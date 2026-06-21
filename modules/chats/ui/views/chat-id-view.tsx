"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { SendIcon, Sparkles, AlertCircle, RefreshCw, Clipboard, Check } from "lucide-react"
import Markdown from "react-markdown"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/error-state"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { LoadingState } from "@/components/loading-state"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/use-confirm"
import { useTRPC } from "@/trpc/client"
import { ChatIdViewHeader } from "../components/chat-id-view-header"
import { UpdateChatDialog } from "../components/update-chat-dialog"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
    chatId: string
}

// Custom code component with syntax window and copy capabilities
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            toast.success("Code snippet copied")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy snippet")
        }
    }

    return (
        <div className="my-4 rounded-xl border border-white/[0.08] bg-[#090b0e] overflow-hidden font-mono text-sm shadow-lg select-text">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#11141b] text-xs text-[#8892b0] select-none">
                <span className="uppercase font-semibold tracking-wider text-[10px] text-[#8892b0]/70">{language}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/[0.05] hover:text-white transition-all font-semibold cursor-pointer text-[#8892b0]"
                >
                    {copied ? (
                        <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Clipboard className="size-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto scrollbar-none leading-relaxed text-[#d0d6e2] bg-[#090b0e] select-text">
                <code>{code}</code>
            </pre>
        </div>
    )
}

export const ChatIdView = ({ chatId }: Props) => {
    const [message, setMessage] = useState("")
    const [updateChatDialogOpen, setUpdateChatDialogOpen] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    // Get current chat details
    const { data } = useSuspenseQuery(trpc.chats.getOne.queryOptions({ id: chatId }))

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete thread?",
        "This will permanently remove the full message history."
    )

    // Mutations
    const sendMessage = useMutation(
        trpc.chats.sendMessage.mutationOptions({
            onSuccess: async () => {
                setMessage("")
                await queryClient.invalidateQueries(trpc.chats.getOne.queryOptions({ id: chatId }))
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const removeChat = useMutation(
        trpc.chats.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.chats.getMany.queryOptions({}))
                router.push("/dashboard/chats")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    // Auto-scroll on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data.messages.length, sendMessage.isPending])

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = Math.min(el.scrollHeight, 180) + "px"
    }, [message])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const content = message.trim()
        if (!content || sendMessage.isPending) return

        sendMessage.mutate({ chatId, content })
    }

    const handleRemoveChat = async () => {
        const ok = await confirmRemove()
        if (!ok) return

        await removeChat.mutateAsync({ id: chatId })
    }

    return (
        <>
            <RemoveConfirmation />
            <UpdateChatDialog
                open={updateChatDialogOpen}
                onOpenChange={setUpdateChatDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 px-4 md:px-8 flex flex-col bg-[#0D0F12] min-h-0 relative select-none">
                <ChatIdViewHeader
                    chatId={chatId}
                    chatTitle={data.title}
                    onEdit={() => setUpdateChatDialogOpen(true)}
                    onRemove={handleRemoveChat}
                />

                {/* ── Scrollable Chat Messages Container ── */}
                <div className="flex-1 overflow-y-auto scrollbar-none pb-40 space-y-6 pt-2 select-text">
                    
                    {data.messages.length === 0 && (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-y-4 px-4">
                            <div className="relative">
                                <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-16 border border-white/[0.06] rounded-full shadow-lg" />
                                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#161920] border border-white/[0.08] flex items-center justify-center">
                                    <Sparkles className="size-2.5 text-[#8b5cf6] animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Chat with {data.agent?.name || "Gemini Assistant"}</h3>
                                <p className="text-sm text-[#8892b0] max-w-sm mt-1 leading-relaxed">
                                    {data.agent?.instructions || "Ask anything. I am a helpful AI assistant."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto space-y-5">
                        {data.messages.map((item) => {
                            const isUser = item.role === "user"

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex gap-x-4",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isUser && (
                                        <GeneratedAvatar
                                            seed={data.agent?.name || "Gemini"}
                                            variant="botttsNeutral"
                                            className="size-8 shrink-0 border border-white/[0.06] rounded-full"
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[85%] md:max-w-[75%] rounded-2xl px-4.5 py-3 text-[14.5px] leading-relaxed shadow-md",
                                            isUser
                                                ? "bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-white rounded-tr-none"
                                                : "text-[#d0d6e2]"
                                        )}
                                    >
                                        <Markdown
                                            components={{
                                                p: (props) => <p className="mb-3 last:mb-0" {...props} />,
                                                ul: (props) => <ul className="mb-3 list-disc pl-5 space-y-1" {...props} />,
                                                ol: (props) => <ol className="mb-3 list-decimal pl-5 space-y-1" {...props} />,
                                                code({ className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || "")
                                                    const isInline = !className
                                                    if (isInline) {
                                                        return (
                                                            <code className="rounded bg-[#181a23] border border-white/[0.06] px-1.5 py-0.5 text-xs text-rose-300 font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                    const codeText = String(children).replace(/\n$/, "")
                                                    return <CodeBlock code={codeText} language={match ? match[1] : "code"} />
                                                }
                                            }}
                                        >
                                            {item.content}
                                        </Markdown>
                                    </div>
                                </div>
                            )
                        })}

                        {sendMessage.isPending && (
                            <div className="flex gap-x-4 justify-start">
                                <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-8 border border-white/[0.06] rounded-full animate-pulse" />
                                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4.5 py-3 text-sm text-[#8892b0]/70 flex items-center gap-2">
                                    <RefreshCw className="size-3.5 animate-spin text-[#8b5cf6]" />
                                    <span>Assistant is writing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* ── Fixed Bottom Message Input ── */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D0F12] via-[#0D0F12]/98 to-transparent pb-6 pt-16 px-4 z-20 select-none">
                    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
                        
                        <div className="relative rounded-2xl border border-white/[0.08] bg-[#14171f]/80 backdrop-blur-md shadow-2xl shadow-black/40 transition-all duration-200 focus-within:border-white/[0.15] focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.2)]">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder={`Message ${data.agent?.name || "Assistant"}...`}
                                rows={1}
                                className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-white placeholder:text-[#8892b0]/50 focus:outline-none text-[15px] leading-relaxed min-h-[56px] max-h-[180px]"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault()
                                        event.currentTarget.form?.requestSubmit()
                                    }
                                }}
                            />
                            
                            <div className="flex items-center justify-between px-3.5 pb-3">
                                {/* Left: Active agent preview */}
                                <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.05] px-2.5 py-1 text-[11px] text-[#8892b0] select-none">
                                    <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-3.5" />
                                    <span className="font-semibold text-white/80">{data.agent?.name || "Gemini Assistant"}</span>
                                </div>

                                {/* Right: Send button */}
                                <button
                                    type="submit"
                                    disabled={!message.trim() || sendMessage.isPending}
                                    className={cn(
                                        "flex items-center justify-center size-9 rounded-xl transition-all duration-150 shrink-0 cursor-pointer",
                                        message.trim() && !sendMessage.isPending
                                            ? "bg-gradient-to-br from-[#8b5cf6] to-[#10b981] text-white shadow-lg shadow-[#8b5cf6]/20 hover:brightness-110 active:scale-95"
                                            : "bg-white/[0.03] text-[#8892b0]/30 cursor-not-allowed border border-white/[0.05]"
                                    )}
                                >
                                    <SendIcon className="size-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export const ChatIdViewLoading = () => {
    return <LoadingState title="Loading Chat" description="This may take a few seconds" />
}

export const ChatIdViewError = () => {
    return <ErrorState title="Error Loading Chat" description="Please try again later" />
}
