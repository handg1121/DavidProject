import { supabase as supabaseAnon, isSupabaseConfigured } from './supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabase-admin';

interface CheckParams {
  apiKey: string;
  user?: string | null;
}

export interface RateLimitResult {
  ok: boolean;
  status: number;
  message?: string;
  usage?: number;
  limit?: number | null;
  apiKeyRow?: any;
}

const DEFAULT_LIMIT = 200;

function getDbClient() {
  if (isSupabaseAdminConfigured) return supabaseAdmin;
  if (isSupabaseConfigured) return supabaseAnon;
  return null;
}

export async function checkAndIncrementApiKeyUsage({ apiKey, user }: CheckParams): Promise<RateLimitResult> {
  const db = getDbClient();
  if (!db) {
    return { ok: false, status: 500, message: 'Supabase is not configured.' };
  }

  let query = db
    .from('api_keys')
    .select('id, key, user, owner, usage, usage_count, limit, usage_limit')
    .eq('key', apiKey);
  if (user) query = query.eq('user', user);
  const { data, error } = await query;

  if (error) {
    return { ok: false, status: 500, message: `Database error: ${error.message}` };
  }
  if (!data || data.length === 0) {
    return { ok: false, status: 401, message: 'Invalid user or API key.' };
  }

  const row = data[0] as any;
  const currentUsage: number = typeof row.usage === 'number' ? row.usage : (typeof row.usage_count === 'number' ? row.usage_count : 0);
  let limitVal: number | null = typeof row.limit === 'number' ? row.limit : (typeof row.usage_limit === 'number' ? row.usage_limit : null);

  // 기본 한도 설정(없으면 200 지정, best-effort)
  if (limitVal === null) {
    let setLimit = await db.from('api_keys').update({ limit: DEFAULT_LIMIT }).eq('id', row.id).select('limit, usage_limit').single();
    if ((setLimit as any)?.error && (setLimit as any).error.code === '42703') {
      setLimit = await db.from('api_keys').update({ usage_limit: DEFAULT_LIMIT }).eq('id', row.id).select('limit, usage_limit').single();
    }
    limitVal = DEFAULT_LIMIT;
  }

  if (limitVal !== null && currentUsage >= limitVal) {
    return { ok: false, status: 429, message: 'Rate limit exceeded', usage: currentUsage, limit: limitVal };
  }

  // 사용량 증가 (best-effort, 실패 시 오류 반환)
  const newUsage = currentUsage + 1;
  let inc = await db.from('api_keys').update({ usage: newUsage }).eq('id', row.id).select('usage, usage_count').single();
  if ((inc as any)?.error && (inc as any).error.code === '42703') {
    inc = await db.from('api_keys').update({ usage_count: newUsage }).eq('id', row.id).select('usage, usage_count').single();
  }
  if ((inc as any)?.error) {
    return { ok: false, status: 500, message: `Failed to increment usage: ${(inc as any).error.message}` };
  }
  if (!inc?.data) {
    return { ok: false, status: 500, message: 'Failed to increment usage: no data returned' };
  }

  return { ok: true, status: 200, usage: newUsage, limit: limitVal, apiKeyRow: row };
} 