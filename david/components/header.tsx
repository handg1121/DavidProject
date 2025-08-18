"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useRef } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const popupRef = useRef<Window | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "auth:complete") {
        try { popupRef.current?.close() } catch {}
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const openAuthPopup = () => {
    const callback = `${window.location.origin}/auth/popup-complete`
    const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callback)}`
    popupRef.current = window.open(
      url,
      "authPopup",
      "width=520,height=680,menubar=no,toolbar=no,location=no,status=no"
    )
    if (!popupRef.current) {
      // 팝업 차단 시 기본 리디렉션 사용
      window.location.href = url
    }
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold font-heading">David Github Analyzer</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboards">Dashboard</a>
                </Button>
                <div className="flex items-center gap-2">
                  <img
                    src={session?.user?.image || "/placeholder-user.jpg"}
                    alt={session?.user?.name || session?.user?.email || "User"}
                    className="h-8 w-8 rounded-full object-cover border"
                  />
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={openAuthPopup}>
                  Login
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
