import { createClient } from '@supabase/supabase-js';

// 환경 변수 디버깅
console.log('=== Supabase 클라이언트 설정 ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음');

// 환경 변수가 없으면 하드코딩된 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('최종 사용할 URL:', supabaseUrl);
console.log('최종 사용할 키:', supabaseAnonKey ? '설정됨' : '설정되지 않음');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
