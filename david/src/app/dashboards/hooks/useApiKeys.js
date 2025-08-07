import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newKey, setNewKey] = useState("");
  const [editId, setEditId] = useState(null);
  const [editUser, setEditUser] = useState("");
  const [editKey, setEditKey] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      console.log('Fetching API keys...');
      const { data, error } = await supabase.from('api_keys').select('*').order('id', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('API keys fetched successfully:', data);
        setApiKeys(data || []);
      }
    } catch (err) {
      console.error('Unexpected error in fetchApiKeys:', err);
    }
  };

  const handleAdd = async () => {
    if (!newUser || !newKey) return;
    const { data, error } = await supabase.from('api_keys').insert([{ user: newUser, key: newKey }]);
    if (!error) {
      fetchApiKeys();
      setNewUser("");
      setNewKey("");
      return { success: true, message: 'API 키가 성공적으로 추가되었습니다.' };
    } else {
      console.error('Error adding API key:', error);
      return { success: false, message: 'API 키 추가 중 오류가 발생했습니다: ' + error.message };
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말로 이 API 키를 삭제하시겠습니까?')) {
      return { success: false, message: '삭제가 취소되었습니다.', type: 'error' };
    }
    const { error } = await supabase.from('api_keys').delete().eq('id', id);
    if (!error) {
      fetchApiKeys();
      return { success: true, message: 'API 키가 성공적으로 삭제되었습니다.', type: 'error' };
    } else {
      console.error('Error deleting API key:', error);
      return { success: false, message: 'API 키 삭제 중 오류가 발생했습니다: ' + error.message, type: 'error' };
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
    const { error } = await supabase.from('api_keys').update({ user: editUser, key: editKey }).eq('id', editId);
    if (!error) {
      setEditId(null);
      setEditUser("");
      setEditKey("");
      fetchApiKeys();
      return { success: true, message: 'API 키가 성공적으로 수정되었습니다.' };
    } else {
      console.error('Error updating API key:', error);
      return { success: false, message: 'API 키 수정 중 오류가 발생했습니다: ' + error.message };
    }
  };

  const handleAddSave = async () => {
    if (!newUser || !newKey) {
      return { success: false, message: '이름과 API 키를 모두 입력하세요.' };
    }
    const { error } = await supabase.from('api_keys').insert([{ user: newUser, key: newKey }]);
    if (!error) {
      fetchApiKeys();
      setNewUser("");
      setNewKey("");
      setIsAdding(false);
      return { success: true, message: 'API 키가 성공적으로 추가되었습니다.' };
    } else {
      return { success: false, message: 'API 키 추가 중 오류가 발생했습니다: ' + error.message };
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