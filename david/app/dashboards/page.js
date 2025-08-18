"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Notification from "./components/Notification";
import PlanCard from "./components/PlanCard";
import Header from "./components/Header";
import ApiKeyTable from "./components/ApiKeyTable";
import { useApiKeys } from "./hooks/useApiKeys";
import { useNotification } from "./hooks/useNotification";

export default function Dashboards() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 화면 폭에 따라 사이드바 기본 상태를 설정 (lg 이상: 열림, 그 외: 닫힘)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(min-width: 1024px)');
    const apply = (e) => setSidebarOpen(e.matches);
    // 초기 적용
    apply(media);
    // 리스너 등록
    if (media.addEventListener) {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    } else {
      media.addListener(apply);
      return () => media.removeListener(apply);
    }
  }, []);
  
  const {
    apiKeys,
    newUser,
    setNewUser,
    newKey,
    setNewKey,
    editId,
    editUser,
    setEditUser,
    editKey,
    setEditKey,
    isAdding,
    setIsAdding,
    revealedKeys,
    handleAdd,
    handleDelete,
    handleEdit,
    handleSave,
    handleAddSave,
    handleAddCancel,
    toggleKeyVisibility,
  } = useApiKeys();

  const { notification, setNotification, showNotification } = useNotification();

  const totalKeys = apiKeys.length;
  const recentAdded = 1;
  const recentEdited = 0;

  // API 키 관리 함수들을 알림과 함께 래핑
  const handleAddSaveWithNotification = async () => {
    const result = await handleAddSave();
    showNotification(result.message, result.success ? 'success' : 'error');
  };

  const handleSaveWithNotification = async () => { 
    const result = await handleSave();
    showNotification(result.message, result.success ? 'success' : 'error');
  };

  const handleDeleteWithNotification = async (id) => {
    const result = await handleDelete(id);
    showNotification(result.message, result.type || 'error');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1">
        <Notification notification={notification} setNotification={setNotification} />
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        {/* 메인 컨텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PlanCard />

          {/* API Keys Section */}
          <ApiKeyTable
            apiKeys={apiKeys}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
            newUser={newUser}
            setNewUser={setNewUser}
            newKey={newKey}
            setNewKey={setNewKey}
            editId={editId}
            editUser={editUser}
            setEditUser={setEditUser}
            editKey={editKey}
            setEditKey={setEditKey}
            revealedKeys={revealedKeys}
            handleAddSave={handleAddSaveWithNotification}
            handleAddCancel={handleAddCancel}
            handleEdit={handleEdit}
            handleSave={handleSaveWithNotification}
            handleDelete={handleDeleteWithNotification}
            toggleKeyVisibility={toggleKeyVisibility}
            showNotification={showNotification}
          />
        </div>
      </div>
    </div>
  );
} 