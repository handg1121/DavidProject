export const maskApiKey = (key) => {
  if (!key || key.length <= 5) return key;
  return key.substring(0, 5) + '*'.repeat(key.length - 5);
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'API 키가 클립보드에 복사되었습니다.' };
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
    return { success: false, message: '클립보드 복사에 실패했습니다.' };
  }
}; 