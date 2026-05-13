import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeetingGetOne } from "../../types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils"
import Markdown from "react-markdown"
import { Transcript } from "./transcript"
import { ChatProvider } from "./chat-provider"


interface Props {
    data: MeetingGetOne
}

const tabs = [
    { value: "summary", icon: <BookOpenTextIcon />, label: "Summary" },
    { value: "transcript", icon: <FileTextIcon />, label: "Transcript" },
    { value: "recording", icon: <FileVideoIcon />, label: "Recording" },
    { value: "chat", icon: <SparklesIcon />, label: "Ask AI" }
]

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-background rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="bg-background justify-start rounded-none h-13 p-0">
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.icon} {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="chat">
                    <ChatProvider meetingId={data.id} meetingName={data.name} />
                </TabsContent>
                <TabsContent value="transcript">
                    <Transcript meetingId={data.id} />
                </TabsContent>
                <TabsContent value="recording">
                    <div className="rounded-lg border bg-card px-4 py-5">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-background rounded-lg border">
                        <div className="px-4 py-5 flex flex-col gap-3">
                            <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link href={`/dashboard/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>{' '}
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General Summary</p>
                            </div>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon className="text-chart-2" />
                                {data.duration ? formatDuration(data.duration) : "No duration"}
                            </Badge>
                            <div>
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props} />
                                        ),
                                        h2: (props) => (
                                            <h1 className="text-xl font-medium mb-6" {...props} />
                                        ),
                                        h3: (props) => (
                                            <h1 className="text-lg font-medium mb-6" {...props} />
                                        ),
                                        h4: (props) => (
                                            <h1 className="text-base font-medium mb-6" {...props} />
                                        ),
                                        p: (props) => (
                                            <h1 className="mb-6 leading-relaxed" {...props} />
                                        )
                                    }}
                                >
                                    {data.summary}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
