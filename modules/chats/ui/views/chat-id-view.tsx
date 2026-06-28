"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Sparkles, AlertCircle, RefreshCw, Clipboard, Check } from "lucide-react"
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
import { ChatInput } from "@/components/chat-input"

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

    const router = useRouter()
    const pathname = usePathname()
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
                if (pathname.startsWith("/dashboard/chats")) {
                    router.push("/dashboard/chats")
                } else {
                    router.push("/dashboard")
                }
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

    const handleSend = () => {
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
            <div className="flex-1 px-4 md:px-8 flex flex-col bg-background text-foreground min-h-0 relative select-none">
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
                                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Sparkles className="size-2.5 text-primary animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Chat with {data.agent?.name || "Gemini Assistant"}</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-1 leading-relaxed">
                                    {data.agent?.instructions || "Ask anything. I am a helpful AI assistant."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto space-y-5">
                        {data.messages.map((item) => {
                            const isUser = item.role === "user"

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={cn(
                                        "flex gap-x-4 w-full",
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
                                                ? "bg-primary/10 border border-primary/20 text-foreground rounded-tr-none"
                                                : "bg-muted/30 border border-border rounded-2xl rounded-tl-none text-foreground"
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
                                                            <code className="rounded bg-muted border border-border px-1.5 py-0.5 text-xs text-rose-400 dark:text-rose-300 font-mono" {...props}>
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
                                </motion.div>
                            )
                        })}

                        {sendMessage.isPending && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-x-4 justify-start"
                            >
                                <GeneratedAvatar seed={data.agent?.name || "Gemini"} variant="botttsNeutral" className="size-8 border border-white/[0.06] rounded-full animate-pulse" />
                                <div className="bg-muted/30 border border-border rounded-2xl px-4.5 py-3 text-sm text-muted-foreground flex items-center gap-2">
                                    <RefreshCw className="size-3.5 animate-spin text-[#8b5cf6]" />
                                    <span>Assistant is writing...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* ── Fixed Bottom Message Input ── */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-transparent pb-6 pt-16 px-4 z-20 select-none">
                    <div className="mx-auto w-full max-w-3xl">
                        <ChatInput
                            value={message}
                            onChange={setMessage}
                            onSend={handleSend}
                            placeholder={`Message ${data.agent?.name || "Assistant"}...`}
                            selectedAgent={data.agent || { name: "Gemini Assistant" }}
                            isPending={sendMessage.isPending}
                        />
                    </div>
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
