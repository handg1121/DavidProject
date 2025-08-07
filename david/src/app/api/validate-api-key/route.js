import { supabase } from '../../dashboards/supabaseClient';

export async function POST(req) {
  try {
    console.log('=== API 키 검증 시작 ===');
    
    // 모든 헤더 로깅 (디버깅용)
    console.log('모든 헤더:');
    for (const [key, value] of req.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Postman에서 보낸 헤더에서 user와 key 추출
    let user = null;
    let apiKey = null;
    
    // Postman이 자동으로 생성하는 헤더들 (제외할 목록)
    const excludeHeaders = [
      'postman-token',
      'accept',
      'accept-encoding',
      'connection',
      'content-length',
      'content-type',
      'host',
      'user-agent',
      'x-forwarded-for',
      'x-forwarded-host',
      'x-forwarded-port',
      'x-forwarded-proto'
    ];
    
    // 모든 헤더를 순회하면서 API 키 관련 헤더 찾기
    for (const [headerKey, headerValue] of req.headers.entries()) {
      // 제외할 헤더는 건너뛰기
      if (excludeHeaders.includes(headerKey.toLowerCase())) {
        continue;
      }
      
      console.log(`헤더 "${headerKey}"에서 API 키 후보 발견:`, headerValue);
      
      if (headerValue && headerValue.trim() !== '') {
        // 헤더의 Key를 user로, Value를 apiKey로 설정
        user = headerKey;
        apiKey = headerValue;
        console.log(`사용자: ${user}, API 키: ${apiKey}`);
        break;
      }
    }
    
    // Authorization 헤더가 있는 경우 (Bearer 토큰 등)
    if (!user || !apiKey) {
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        console.log('Authorization 헤더 발견:', authHeader);
        
        if (authHeader.startsWith('Bearer ')) {
          // Bearer 토큰의 경우, 토큰 자체를 API 키로 사용
          apiKey = authHeader.substring(7);
          user = 'bearer_user'; // 기본 사용자명
          console.log('Bearer 토큰에서 API 키 추출:', apiKey);
        } else if (authHeader.startsWith('ApiKey ')) {
          apiKey = authHeader.substring(8);
          user = 'apikey_user'; // 기본 사용자명
          console.log('ApiKey 헤더에서 API 키 추출:', apiKey);
        }
      }
    }
    
    // Body에서 시도 (하위 호환성)
    if (!user || !apiKey) {
      try {
        const body = await req.json();
        if (body.user && body.apiKey) {
          user = body.user;
          apiKey = body.apiKey;
          console.log('Body에서 사용자와 API 키 추출:', { user, apiKey });
        }
      } catch (e) {
        console.log('Body 파싱 실패:', e);
      }
    }
    
    console.log('최종 추출된 데이터:', { user, apiKey });
    
    if (!user || !apiKey || user.trim() === '' || apiKey.trim() === '') {
      console.log('사용자명 또는 API 키가 비어있음');
      return new Response(JSON.stringify({ valid: false, error: '사용자명과 API 키가 모두 필요합니다.' }), { status: 401 });
    }
    
    // Supabase에서 user와 key 모두 일치하는 레코드 검색
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user', user.trim())
      .eq('key', apiKey.trim());

    console.log('Supabase 응답:', { data, error });
    console.log('데이터 개수:', data ? data.length : 0);

    if (error) {
      console.error('Supabase 오류:', error);
      return new Response(JSON.stringify({ valid: false, error: '데이터베이스 오류가 발생했습니다.' }), { status: 500 });
    }

    if (data && data.length > 0) {
      console.log('유효한 사용자와 API 키 발견:', data[0]);
      return new Response(JSON.stringify({ valid: true, user: data[0].user }), { status: 200 });
    }
    
    console.log('일치하는 사용자와 API 키를 찾을 수 없음');
    return new Response(JSON.stringify({ valid: false, error: '유효하지 않은 사용자명 또는 API 키입니다.' }), { status: 401 });
  } catch (err) {
    console.error('API 키 검증 중 오류:', err);
    return new Response(JSON.stringify({ valid: false, error: err.message }), { status: 500 });
  }
} 