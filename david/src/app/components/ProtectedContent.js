"use client";

import { useSession } from "next-auth/react";

export default function ProtectedContent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">로그인이 필요한 콘텐츠입니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">환영합니다!</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{session.user?.name}</p>
            <p className="text-sm text-gray-600">{session.user?.email}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            이제 보호된 콘텐츠에 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
} 