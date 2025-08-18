"use client"

import { useEffect } from "react"

export default function PopupCompletePage() {
  useEffect(() => {
    try {
      window.opener?.postMessage("auth:complete", "*")
    } catch {}
    try {
      window.close()
    } catch {}
  }, [])

  return (
    <div className="p-6 text-sm text-muted-foreground">
      로그인이 완료되었습니다. 이 창을 닫아주세요.
    </div>
  )
} 