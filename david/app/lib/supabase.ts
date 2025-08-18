import { createClient } from '@supabase/supabase-js';

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase 클라이언트 생성 (환경 변수가 없으면 에러 방지)
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음');
  
  // 빈 클라이언트 반환 (에러 방지)
  supabase = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase not configured' } }) }) }),
      insert: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase not configured' } }),
      update: () => ({ eq: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase not configured' } }) })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase }; 