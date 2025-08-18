"use client";

import { useSession } from "next-auth/react";

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
} 