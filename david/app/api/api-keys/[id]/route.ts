import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { supabaseAdmin as supabase } from '../../../lib/supabase-admin';

interface ApiKeyRowUpdate {
  user?: string | null; // label
  key?: string;
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

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if ('error' in auth) return auth.error;
  const { email } = auth;

  const { id } = await context.params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  console.log('[api-keys:id] GET', { id, email });

  // 1) owner=email
  let resp = await supabase
    .from('api_keys')
    .select('*')
    .eq('id', id)
    .eq('owner', email)
    .single();

  // 2) owner 컬럼 없거나 결과 없음 → owner_email
  if ((resp.error && isMissingColumnError(resp.error, 'owner')) || (!resp.data && !resp.error)) {
    resp = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('owner_email', email)
      .single();
  }

  // 3) owner_email도 없거나 결과 없음 → user=email(레거시)
  if ((resp.error && isMissingColumnError(resp.error, 'owner_email')) || (!resp.data && !resp.error)) {
    resp = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user', email)
      .single();
  }

  if (resp.error || !resp.data) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(resp.data);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if ('error' in auth) return auth.error;
  const { email } = auth;

  const { id } = await context.params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  let body: ApiKeyRowUpdate;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const update: ApiKeyRowUpdate = {};
  if (typeof body.key === 'string') update.key = body.key.trim();
  if (typeof body.user === 'string' || body.user === null) update.user = body.user;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ message: 'No updatable fields provided' }, { status: 400 });
  }

  // 1) owner=email
  let resp = await supabase
    .from('api_keys')
    .update(update)
    .eq('id', id)
    .eq('owner', email)
    .select('*')
    .single();

  // 2) owner_email
  if ((resp.error && isMissingColumnError(resp.error, 'owner')) || (!resp.data && !resp.error)) {
    resp = await supabase
      .from('api_keys')
      .update(update)
      .eq('id', id)
      .eq('owner_email', email)
      .select('*')
      .single();
  }

  // 3) user=email
  if ((resp.error && isMissingColumnError(resp.error, 'owner_email')) || (!resp.data && !resp.error)) {
    resp = await supabase
      .from('api_keys')
      .update(update)
      .eq('id', id)
      .eq('user', email)
      .select('*')
      .single();
  }

  if (resp.error || !resp.data) {
    return NextResponse.json({ message: 'Failed to update or not found' }, { status: 404 });
  }

  console.log('[api-keys:id] PATCH updated', { id });
  return NextResponse.json(resp.data);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuthenticatedUser(req);
  if ('error' in auth) return auth.error;
  const { email } = auth;

  const { id } = await context.params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  // 1) owner=email
  let del = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('owner', email);

  // 2) owner_email
  if (del.error && isMissingColumnError(del.error, 'owner')) {
    del = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('owner_email', email);
  }

  // 3) user=email
  if (del.error && isMissingColumnError(del.error, 'owner_email')) {
    del = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user', email);
  }

  if (del.error) {
    return NextResponse.json({ message: 'Failed to delete' }, { status: 400 });
  }

  console.log('[api-keys:id] DELETE success', { id });
  return NextResponse.json({ success: true });
} 