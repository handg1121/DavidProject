import { supabase, isSupabaseConfigured } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: "Supabase is not configured.",
          hint: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const headers = req.headers;
    let user: string | null = null;
    let apiKey: string | null = null;

    // 1) 표준 헤더 지원
    apiKey = headers.get("x-api-key") || headers.get("apikey") || apiKey;
    user = headers.get("x-user") || headers.get("user") || user;

    // 2) Authorization: Bearer <token> | ApiKey <token>
    if (!apiKey) {
      const auth = headers.get("authorization");
      if (auth) {
        const lower = auth.toLowerCase();
        if (lower.startsWith("bearer ")) {
          apiKey = auth.slice(7).trim();
        } else if (lower.startsWith("apikey ")) {
          apiKey = auth.slice(7).trim();
        }
      }
    }

    // 3) Body JSON fallback
    if (!apiKey) {
      try {
        const body = await req.json();
        apiKey = body?.apiKey || apiKey;
        user = body?.user || user;
      } catch {}
    }

    // 4) 헤더 스캔 fallback (src 구현 호환): 제외 목록 외의 첫 번째 커스텀 헤더를 (user, key)로 간주
    if (!apiKey || !user) {
      const exclude = new Set([
        "postman-token",
        "accept",
        "accept-encoding",
        "connection",
        "content-length",
        "content-type",
        "host",
        "user-agent",
        "x-forwarded-for",
        "x-forwarded-host",
        "x-forwarded-port",
        "x-forwarded-proto",
        "apikey",
        "x-api-key",
        "authorization",
      ]);
      for (const [k, v] of headers.entries()) {
        const lk = k.toLowerCase();
        if (exclude.has(lk)) continue;
        if (v && v.trim() !== "") {
          if (!user) user = k;
          if (!apiKey) apiKey = v;
          break;
        }
      }
    }

    // 정규화: 공백 제거
    user = user?.trim() || null;
    apiKey = apiKey?.trim() || null;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "API key is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let query = supabase.from("api_keys").select("*").eq("key", apiKey);
    if (user) {
      query = query.eq("user", user);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ valid: false, error: "Database error.", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ valid: Boolean(data && data.length > 0), user: data?.[0]?.user || null, count: data?.length || 0 }),
      { status: data && data.length > 0 ? 200 : 401, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ valid: false, error: err?.message || "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 