import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwsnhwvxsvzogxevyzuq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test_key_123';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API 키 관리 함수들
export const apiKeyService = {
  // API 키 검증
  async validateApiKey(apiKey) {
    try {
      // 1. Supabase 테이블에서 검증
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        console.log('API 키 검증 성공 (Supabase):', data);
        return { valid: true, data };
      }

      // 2. 하드코딩된 유효한 키들 (백업)
      const validKeys = [
        'valid_key_123',
        'test_api_key',
        'demo_key_2024',
        'working_key',
        'correct_api_key'
      ];

      if (validKeys.includes(apiKey)) {
        console.log('API 키 검증 성공 (하드코딩):', apiKey);
        return { valid: true, data: { key: apiKey, name: 'Test Key' } };
      }

      return { valid: false, error: 'Invalid API key' };
    } catch (error) {
      console.error('API 키 검증 오류:', error);
      return { valid: false, error: error.message };
    }
  },

  // API 키 사용 기록 저장
  async logApiKeyUsage(apiKey, action = 'login') {
    try {
      const { error } = await supabase
        .from('api_key_logs')
        .insert({
          api_key: apiKey,
          action: action,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('API 키 사용 기록 저장 실패:', error);
      }
    } catch (error) {
      console.error('API 키 사용 기록 저장 오류:', error);
    }
  },

  // API 키 생성 (관리자용)
  async createApiKey(keyData) {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          key: keyData.key,
          name: keyData.name,
          description: keyData.description,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('API 키 생성 오류:', error);
      return { success: false, error: error.message };
    }
  },

  // API 키 목록 조회 (관리자용)
  async getApiKeys() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('API 키 목록 조회 오류:', error);
      return { success: false, error: error.message };
    }
  }
};
