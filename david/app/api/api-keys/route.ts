import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabaseAdmin as supabase } from '../../lib/supabase-admin';

interface ApiKeyRow {
  id: string;
  owner?: string | null; // email owner
  user?: string | null; // label
  key: string;
  created_at?: string;
  updated_at?: string;
}

function extractEmailFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader) return null;
  const prefix = 'Bearer ';
  if (!authHeader.startsWith(prefix)) return null;
  const token = authHeader.slice(prefix.length).trim();
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    return decoded.includes('@') ? decoded : null;
  } catch {
    return null;
  }
}

function isMissingColumnError(err: any, column: string): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  return (
    err.code === '42703' ||
    (msg.includes(column.toLowerCase()) && (msg.includes('does not exist') || msg.includes('schema cache') || msg.includes('column')))
  );
}

async function getAuthenticatedUser(req: Request) {
  const headerEmail = extractEmailFromRequest(req);
  if (headerEmail) {
    const { data: userRow } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', headerEmail)
      .single();

    if (!userRow) {
      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .insert([{ email: headerEmail }])
        .select('id, email')
        .single();
      if (insertError || !inserted) {
        return { error: NextResponse.json({ message: 'User not found', details: insertError?.message }, { status: 401 }) };
      }
      return { userId: inserted.id as string, email: headerEmail };
    }
    return { userId: userRow.id as string, email: headerEmail };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }

  const email = session.user.email;

  let { data: userRow } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (!userRow) {
    const { data: inserted, error: insertError } = await supabase
      .from('users')
      .insert([{ email }])
      .select('id, email')
      .single();
    if (insertError || !inserted) {
      return { error: NextResponse.json({ message: 'User not found', details: insertError?.message }, { status: 401 }) };
    }
    userRow = inserted;
  }

  return { userId: userRow.id as string, email };
}

export async function GET(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if ('error' in auth) return auth.error;
  const { email } = auth;

  // owner=email 기준
  const byOwnerResp = await supabase
    .from('api_keys')
    .select('*')
    .eq('owner', email)
    .order('id', { ascending: true });

  if (byOwnerResp.error && isMissingColumnError(byOwnerResp.error, 'owner')) {
    // 최후 폴백: user=email (레거시)
    const legacyOnly = await supabase
      .from('api_keys')
      .select('*')
      .eq('user', email)
      .order('id', { ascending: true });

    if (legacyOnly.error) {
      return NextResponse.json({ message: 'Failed to fetch API keys', details: legacyOnly.error.message }, { status: 500 });
    }
    return NextResponse.json(legacyOnly.data ?? []);
  }

  if (byOwnerResp.error) {
    return NextResponse.json({ message: 'Failed to fetch API keys', details: byOwnerResp.error.message }, { status: 500 });
  }

  // 레거시 백필: owner가 비어 있고 user=email인 레코드 → owner=email로 채움
  const legacy = await supabase
    .from('api_keys')
    .select('id')
    .is('owner', null)
    .eq('user', email);

  if (!legacy.error && legacy.data && legacy.data.length > 0) {
    await supabase.from('api_keys').update({ owner: email }).in('id', legacy.data.map((r: ApiKeyRow) => r.id));
  }

  return NextResponse.json(byOwnerResp.data ?? []);
}

export async function POST(req: Request) {
  const auth = await getAuthenticatedUser(req);
  if ('error' in auth) return auth.error;
  const { email } = auth;

  let body: Partial<ApiKeyRow>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const apiKey = (body.key ?? '').toString().trim();
  const label = (body.user ?? '').toString().trim();
  if (!apiKey) {
    return NextResponse.json({ message: 'key is required' }, { status: 400 });
  }

  console.log('[api-keys] POST create', { email });

  let insert = await supabase
    .from('api_keys')
    .insert([{ owner: email, key: apiKey, user: label || null }])
    .select('*')
    .single();

  if (insert.error && isMissingColumnError(insert.error, 'owner')) {
    // 최후 폴백: user=email (라벨은 저장 불가)
    insert = await supabase
      .from('api_keys')
      .insert([{ user: email, key: apiKey }])
      .select('*')
      .single();
  }

  if (insert.error) {
    return NextResponse.json({ message: 'Failed to create API key', details: insert.error.message }, { status: 500 });
  }

  // 생성 직후 초기화
  const newId = (insert.data as any)?.id as string;
  if (newId) {
    let init = await supabase.from('api_keys').update({ usage: 0 }).eq('id', newId).select('id').single();
    if ((init as any)?.error && (init as any).error.code === '42703') {
      init = await supabase.from('api_keys').update({ usage_count: 0 }).eq('id', newId).select('id').single();
    }
    let limitSet = await supabase.from('api_keys').update({ limit: 200 }).eq('id', newId).select('id').single();
    if ((limitSet as any)?.error && (limitSet as any).error.code === '42703') {
      limitSet = await supabase.from('api_keys').update({ usage_limit: 200 }).eq('id', newId).select('id').single();
    }
  }

  console.log('[api-keys] POST created', { id: newId, email });
  return NextResponse.json(insert.data, { status: 201 });
} 