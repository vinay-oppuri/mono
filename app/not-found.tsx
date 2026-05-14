import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-9xl font-bold tracking-tighter text-foreground/10">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Page not found</h2>
          <p className="mx-auto max-w-[400px] text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved to another workspace.
          </p>
        </div>
        <Button asChild className="rounded-full px-8 shadow-lg shadow-primary/10">
          <Link href="/">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to home
          </Link>
        </Button>
      </div>
      <div className="mt-12 text-sm text-muted-foreground">
        Mono &copy; {new Date().getFullYear()}
      </div>
    </div>
  )
}
