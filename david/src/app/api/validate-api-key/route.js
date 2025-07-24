import { supabase } from '../../dashboards/supabaseClient';

export async function POST(req) {
  try {
    const { apiKey } = await req.json();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey);

    if (!error && data && data.length > 0) {
      return new Response(JSON.stringify({ valid: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ valid: false }), { status: 401 });
  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: err.message }), { status: 500 });
  }
} 