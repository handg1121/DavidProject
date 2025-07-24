import { createClient } from '@supabase/supabase-js';

// 더 간단한 테스트용 API 키
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwsnhwvxsvzogxevyzuq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test_key_123';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
