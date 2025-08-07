import { createClient } from '@supabase/supabase-js';

// 환경 변수 디버깅
console.log('=== Supabase 클라이언트 설정 ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음');

// 환경 변수가 없으면 하드코딩된 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwsnhwvxsvzogxevyzuq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3c25od3Z4c3Z6b2d4ZXZ5enVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTI1MjAsImV4cCI6MjA2ODAyODUyMH0.5BSux4quKMPU0zkl2qouHgfJpU0HDO2yR_laN_OsCKo';

console.log('최종 사용할 URL:', supabaseUrl);
console.log('최종 사용할 키:', supabaseAnonKey ? '설정됨' : '설정되지 않음');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
