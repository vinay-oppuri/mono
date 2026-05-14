"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { SendIcon } from "lucide-react"
import Markdown from "react-markdown"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ErrorState } from "@/components/error-state"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { LoadingState } from "@/components/loading-state"
import { cn } from "@/lib/utils"
import { useConfirm } from "@/hooks/use-confirm"
import { useTRPC } from "@/trpc/client"
import { ChatIdViewHeader } from "../components/chat-id-view-header"
import { UpdateChatDialog } from "../components/update-chat-dialog"

interface Props {
    chatId: string
}

export const ChatIdView = ({ chatId }: Props) => {
    const [message, setMessage] = useState("")
    const [updateChatDialogOpen, setUpdateChatDialogOpen] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const { data } = useSuspenseQuery(trpc.chats.getOne.queryOptions({ id: chatId }))

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "This will remove the full chat history."
    )

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

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data.messages.length, sendMessage.isPending])

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
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col bg-card/60 gap-y-4 min-h-0">
                <ChatIdViewHeader
                    chatId={chatId}
                    chatTitle={data.title}
                    onEdit={() => setUpdateChatDialogOpen(true)}
                    onRemove={handleRemoveChat}
                />
                <div className="flex-1 min-h-[calc(100vh-15rem)] rounded-lg border border-foreground/5 bg-background flex flex-col overflow-hidden">
                    <div className="border-b border-foreground/5 px-4 py-3 flex items-center gap-x-3">
                        <GeneratedAvatar seed={data.agent.name} variant="botttsNeutral" className="size-9" />
                        <div className="min-w-0">
                            <h2 className="font-medium truncate">{data.agent.name}</h2>
                            <p className="text-sm text-muted-foreground truncate">{data.agent.instructions}</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                        {data.messages.length === 0 && (
                            <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-y-3">
                                <GeneratedAvatar seed={data.agent.name} variant="botttsNeutral" className="size-16" />
                                <div>
                                    <h3 className="text-xl font-semibold">Chat with {data.agent.name}</h3>
                                    <p className="text-sm text-muted-foreground max-w-md">
                                        Ask anything. This agent will answer using the instructions you gave it.
                                    </p>
                                </div>
                            </div>
                        )}

                        {data.messages.map((item) => {
                            const isUser = item.role === "user"

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex gap-x-3",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {!isUser && (
                                        <GeneratedAvatar
                                            seed={data.agent.name}
                                            variant="botttsNeutral"
                                            className="size-8 shrink-0"
                                        />
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-3 text-sm leading-relaxed",
                                            isUser
                                                ? "bg-primary/60 text-primary-foreground"
                                                : "bg-muted/30 text-foreground"
                                        )}
                                    >
                                        <Markdown
                                            components={{
                                                p: (props) => <p className="mb-3 last:mb-0" {...props} />,
                                                ul: (props) => <ul className="mb-3 list-disc pl-5" {...props} />,
                                                ol: (props) => <ol className="mb-3 list-decimal pl-5" {...props} />,
                                                code: (props) => (
                                                    <code className="rounded bg-background/70 px-1 py-0.5" {...props} />
                                                )
                                            }}
                                        >
                                            {item.content}
                                        </Markdown>
                                    </div>
                                </div>
                            )
                        })}

                        {sendMessage.isPending && (
                            <div className="flex gap-x-3 justify-start">
                                <GeneratedAvatar seed={data.agent.name} variant="botttsNeutral" className="size-8" />
                                <div className="bg-muted rounded-lg px-4 py-3 text-sm text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-foreground/5 p-3 flex items-end gap-x-2">
                        <Textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder={`Message ${data.agent.name}...`}
                            className="min-h-10 max-h-40 resize-none bg-muted/30! border-foreground/5!"
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault()
                                    event.currentTarget.form?.requestSubmit()
                                }
                            }}
                        />
                        <Button type="submit" size="icon" disabled={!message.trim() || sendMessage.isPending} className="h-10! w-10!">
                            <SendIcon className="size-4" />
                        </Button>
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
