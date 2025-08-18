"use client"

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function MobileNav() {
  const { data: session, status } = useSession()

  const openAuthPopup = () => {
    const callback = `${window.location.origin}/auth/popup-complete`
    const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callback)}`
    const w = window.open(
      url,
      "authPopup",
      "width=520,height=680,menubar=no,toolbar=no,location=no,status=no"
    )
    if (!w) {
      window.location.href = url
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col gap-4">
          <a href="#features" className="text-base text-foreground/80 hover:text-foreground">Features</a>
          <a href="#pricing" className="text-base text-foreground/80 hover:text-foreground">Pricing</a>
          <a href="#about" className="text-base text-foreground/80 hover:text-foreground">About</a>
          <a href="#contact" className="text-base text-foreground/80 hover:text-foreground">Contact</a>
          {status === "authenticated" ? (
            <>
              <Button asChild variant="secondary" className="mt-2">
                <a href="/dashboards">Dashboard</a>
              </Button>
              <div className="flex items-center gap-3 border-t pt-4 mt-2">
                <img
                  src={session?.user?.image || "/placeholder-user.jpg"}
                  alt={session?.user?.name || session?.user?.email || "User"}
                  className="h-8 w-8 rounded-full object-cover border"
                />
                <div className="text-sm">
                  <div className="font-medium">{session?.user?.name || session?.user?.email}</div>
                </div>
              </div>
              <Button variant="ghost" className="justify-start" onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <Button className="mt-2" onClick={openAuthPopup}>Login</Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
} 