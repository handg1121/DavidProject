"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthSection() {
  const { data: session, status } = useSession();

  const openAuthPopup = () => {
    const callback = `${window.location.origin}/auth/popup-complete`;
    const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callback)}`;
    const w = window.open(
      url,
      "authPopup",
      "width=520,height=680,menubar=no,toolbar=no,location=no,status=no"
    );
    if (!w) {
      window.location.href = url;
    }
  };

  if (status === "loading") {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {session?.user ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm">안녕하세요, {session.user.name || session.user.email}</p>
            <Button variant="outline" onClick={() => signOut()}>로그아웃</Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button onClick={openAuthPopup}>Google로 로그인</Button>
          </div>
        )}
      </div>
    </section>
  );
} 