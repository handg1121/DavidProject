import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && supabaseServiceKey);

let supabaseAdmin: any;

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('Supabase Admin 환경 변수가 설정되지 않았습니다:');
	console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
	console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '설정되지 않음');

	supabaseAdmin = {
		from: () => ({
			select: () => ({ eq: () => ({ single: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase admin not configured' } }) }) }),
			insert: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase admin not configured' } }),
			update: () => ({ eq: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase admin not configured' } }) }),
			delete: () => ({ data: null, error: { code: 'ENV_ERROR', message: 'Supabase admin not configured' } })
		})
	};
} else {
	supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

export { supabaseAdmin }; 