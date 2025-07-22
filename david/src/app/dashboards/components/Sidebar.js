import React from 'react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Sidebar */}
      <div className={`relative transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r flex flex-col justify-between min-h-screen shadow-sm overflow-hidden`}>
        <div className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 h-full flex flex-col justify-between`}>
          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <span className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="8" height="8" rx="2" fill="#FFD600"/><rect x="12" y="12" width="8" height="8" rx="2" fill="#2979FF"/><rect x="22" y="22" width="8" height="8" rx="2" fill="#FF1744"/></svg>
              David AI
            </span>
          </div>
          {/* Workspace Dropdown */}
          <div className="px-6 mb-6">
            <button className="w-full flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=48&h=48" alt="profile" className="w-6 h-6 rounded-full" />
                Personal
              </span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          {/* Menu */}
          <nav className="flex-1 px-4 space-y-1">
            <a href="#" className="flex items-center px-4 py-2 text-gray-900 bg-gray-100 rounded-lg font-semibold gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" /></svg>
              Overview
            </a>
            <a href="/playground" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 18v-2a4 4 0 00-3-3.87M7 10V6a4 4 0 014-4 4 4 0 014 4v4m-4 4v4m0 0v4m0-4h4m-4 0H7" /></svg>
              API Playground
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
              Use Cases
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
              Billing
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Settings
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              Documentation
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4a1 1 0 001 1h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 13V5a2 2 0 012-2h7l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2z" /></svg>
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" /></svg>
              Tavily MCP
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4a1 1 0 001 1h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 13V5a2 2 0 012-2h7l5 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2z" /></svg>
            </a>
          </nav>
          {/* Profile */}
          <div className="px-6 py-6 border-t flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=48&h=48" alt="profile" className="w-8 h-8 rounded-full" />
            <span className="font-medium text-gray-900">모레인간123</span>
            <svg className="w-5 h-5 ml-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
        {/* 접기 버튼 (사이드바 열려있을 때만) */}
        {sidebarOpen && (
          <button
            className="absolute top-1/2 right-0 -translate-y-1/2 z-50 bg-white border shadow p-1 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            title="사이드바 접기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
      {/* 펼치기 버튼 (사이드바 닫혀있을 때만) */}
      {!sidebarOpen && (
        <button
          className="fixed top-1/2 left-0 -translate-y-1/2 z-50 bg-white border shadow p-1 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          title="사이드바 펼치기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar; 