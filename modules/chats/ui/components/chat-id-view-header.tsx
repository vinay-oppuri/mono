import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    chatId: string
    chatTitle: string
}

export const ChatIdViewHeader = ({ chatId, chatTitle }: Props) => {
    return (
        <div className="flex items-center justify-between py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-left">
                            <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-left text-foreground">
                            <Link href={`/dashboard?chatId=${chatId}`}>{chatTitle}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
