import { supabase, isSupabaseConfigured } from "@/app/lib/supabase";
import { summarizeReadmeWithLangChain } from "./chain";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return new Response(JSON.stringify({
    message: 'GitHub Summarizer API',
    method: 'GET',
    note: 'POST 요청을 사용하여 GitHub URL과 API 키를 전송하세요.'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, apikey, user, x-user',
    },
  });
}

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured) {
      return new Response(JSON.stringify({ valid: false, error: 'Supabase is not configured.' }), { status: 500 });
    }

    const headers = req.headers;
    let user: string | null = null;
    let apiKey: string | null = null;

    // 표준 헤더
    apiKey = headers.get('x-api-key') || headers.get('apikey') || apiKey;
    user = headers.get('x-user') || headers.get('user') || user;

    // Authorization
    if (!apiKey) {
      const auth = headers.get('authorization');
      if (auth) {
        const lower = auth.toLowerCase();
        if (lower.startsWith('bearer ')) apiKey = auth.slice(7).trim();
        else if (lower.startsWith('apikey ')) apiKey = auth.slice(7).trim();
      }
    }

    // Body 파싱
    let body: any = null;
    try {
      body = await req.json();
    } catch {}
    if (body) {
      if (!apiKey) apiKey = body?.apiKey || null;
      if (!user) user = body?.user || null;
    }

    // 헤더 스캔 폴백
    if (!apiKey || !user) {
      const exclude = new Set([
        'postman-token','accept','accept-encoding','connection','content-length','content-type','host','user-agent',
        'x-forwarded-for','x-forwarded-host','x-forwarded-port','x-forwarded-proto','apikey','x-api-key','authorization'
      ]);
      for (const [k, v] of headers.entries()) {
        const lk = k.toLowerCase();
        if (exclude.has(lk)) continue;
        if (v && v.trim() !== '') {
          if (!user) user = k;
          if (!apiKey) apiKey = v;
          break;
        }
      }
    }

    user = user?.trim() || null;
    apiKey = apiKey?.trim() || null;

    const githubUrl: string | null = body?.githubUrl || null;
    if (!githubUrl) {
      return new Response(JSON.stringify({ valid: false, error: 'GitHub URL이 필요합니다.' }), { status: 400 });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ valid: false, error: 'API key is required.' }), { status: 400 });
    }

    // Supabase 확인
    let query = supabase.from('api_keys').select('*').eq('key', apiKey);
    if (user) query = query.eq('user', user);
    const { data, error } = await query;
    if (error) {
      return new Response(JSON.stringify({ valid: false, error: 'Database error.', details: error.message }), { status: 500 });
    }
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ valid: false, error: '유효하지 않은 사용자명 또는 API 키입니다.' }), { status: 401 });
    }

    // README 불러오기
    const readme = await getReadmeContent(githubUrl);
    if (!readme) {
      return new Response(JSON.stringify({ valid: false, error: 'README.md를 찾을 수 없습니다.' }), { status: 404 });
    }

    const summary = await summarizeReadmeWithLangChain(readme);
    const responseData: any = { valid: true, url: githubUrl };
    if (summary && typeof summary === 'object') responseData.summary = summary;
    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ valid: false, error: err?.message || 'Unexpected error' }), { status: 500 });
  }
}

async function getReadmeContent(githubUrl: string) {
  try {
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/.*)?$/);
    if (!match) throw new Error('유효하지 않은 GitHub 저장소 URL입니다.');
    const owner = match[1];
    const repo = match[2];
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/vnd.github.v3.raw' } });
    if (!res.ok) throw new Error(`README.md를 가져오는 데 실패했습니다. (status: ${res.status})`);
    return await res.text();
  } catch {
    return null;
  }
} 