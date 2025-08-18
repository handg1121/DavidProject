"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export function AuthSection() {
  const { data: session, status } = useSession();

  return (
    <section id="login" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {session ? '환영합니다!' : '로그인하세요'}
          </h2>
          <p className="text-gray-600 mb-8">
            {session 
              ? `${session.user?.name || session.user?.email}님, API Key 관리 대시보드에 접근하세요.`
              : 'Google 계정으로 로그인하여 API Key를 관리하세요.'
            }
          </p>
          
          <div className="space-y-4">
            {session ? (
              <div className="space-y-4">
                <Button 
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full"
                >
                  로그아웃
                </Button>
                <Button 
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <a href="/dashboards">
                    API Key 연습 프로젝트 대시보드
                  </a>
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signIn('google')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Google로 로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 