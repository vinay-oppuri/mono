"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignInDialog from "@/modules/auth/ui/components/sign-in-dialog"

export const HeroCTA = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const goToApp = () => {
    if (session) {
      router.push("/dashboard")
      return
    }
    setIsDialogOpen(true)
  }

  return (
    <>
      <SignInDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Button onClick={goToApp} size="lg" className="rounded-full px-6">
        Create an agent
        <ArrowRightIcon />
      </Button>
    </>
  )
}
