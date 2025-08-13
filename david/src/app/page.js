"use client";

import Image from "next/image";
import LoginButton from "./components/LoginButton";
import ProtectedContent from "./components/ProtectedContent";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* 로그인 버튼 추가 */}
        <div className="flex flex-col items-center gap-4">
          <LoginButton />
        </div>

        {/* 대시보드로 이동하는 버튼 추가 */}
        {session ? (
          <a
            href="/dashboards"
            className="mt-4 rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            API Key 연습 프로젝트 대시보드
          </a>
        ) : (
          <button
            disabled
            className="mt-4 rounded bg-gray-400 text-gray-200 px-4 py-2 font-semibold cursor-not-allowed text-center"
          >
            API Key 연습 프로젝트 대시보드 (로그인 필요)
          </button>
        )}

      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
