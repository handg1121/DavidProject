import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newKey, setNewKey] = useState("");
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState("");
  const [editKey, setEditKey] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const { data: session } = useSession();

  function getAuthHeaders() {
    const apiToken = session?.apiToken || "";
    const headers = { };
    if (apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    }
    return headers;
  }

  useEffect(() => {
    fetchApiKeys();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.apiToken]);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/api-keys', { method: 'GET', headers: getAuthHeaders() });
      if (!res.ok) {
        setApiKeys([]);
        return;
      }
      const data = await res.json();
      setApiKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Unexpected error in fetchApiKeys:', err);
      setApiKeys([]);
    }
  };

  const handleAdd = async () => {
    if (!newUser || !newKey) return;
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ user: newUser, key: newKey }),
    });
    if (res.ok) {
      await fetchApiKeys();
      setNewUser("");
      setNewKey("");
      return { success: true, message: 'API 키가 성공적으로 추가되었습니다.' };
    } else {
      const data = await res.json().catch(() => ({}));
      console.error('Error adding API key:', data);
      return { success: false, message: 'API 키 추가 중 오류가 발생했습니다: ' + (data?.details || data?.message || res.statusText) };
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말로 이 API 키를 삭제하시겠습니까?')) {
      return { success: false, message: '삭제가 취소되었습니다.', type: 'error' };
    }
    const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) {
      await fetchApiKeys();
      return { success: true, message: 'API 키가 성공적으로 삭제되었습니다.', type: 'error' };
    } else {
      const data = await res.json().catch(() => ({}));
      console.error('Error deleting API key:', data);
      return { success: false, message: 'API 키 삭제 중 오류가 발생했습니다: ' + (data?.details || data?.message || res.statusText), type: 'error' };
    }
  };

  const handleEdit = (id, user, key) => {
    setEditId(id);
    setEditUser(user);
    setEditKey(key);
  };

  const handleSave = async () => {
    if (!editUser || !editKey) {
      return { success: false, message: '사용자명과 API 키를 모두 입력해주세요.' };
    }
    const res = await fetch(`/api/api-keys/${editId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ user: editUser, key: editKey })
    });
    if (res.ok) {
      setEditId(null);
      setEditUser("");
      setEditKey("");
      await fetchApiKeys();
      return { success: true, message: 'API 키가 성공적으로 수정되었습니다.' };
    } else {
      const data = await res.json().catch(() => ({}));
      console.error('Error updating API key:', data);
      return { success: false, message: 'API 키 수정 중 오류가 발생했습니다: ' + (data?.details || data?.message || res.statusText) };
    }
  };

  const handleAddSave = async () => {
    if (!newUser || !newKey) {
      return { success: false, message: '이름과 API 키를 모두 입력하세요.' };
    }
    const res = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ user: newUser, key: newKey }),
    });
    if (res.ok) {
      await fetchApiKeys();
      setNewUser("");
      setNewKey("");
      setIsAdding(false);
      return { success: true, message: 'API 키가 성공적으로 추가되었습니다.' };
    } else {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: 'API 키 추가 중 오류가 발생했습니다: ' + (data?.details || data?.message || res.statusText) };
    }
  };

  const handleAddCancel = () => {
    setNewUser("");
    setNewKey("");
    setIsAdding(false);
  };

  const toggleKeyVisibility = (id) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return {
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
  };
}; 