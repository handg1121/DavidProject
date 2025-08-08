import { supabase } from '../../dashboards/supabaseClient';
import { summarizeReadmeWithLangChain } from './chain';

// 동적 라우트 설정 - SSG에서 제외
export const dynamic = 'force-dynamic';

// GET 요청 처리
export async function GET(req) {
  return new Response(JSON.stringify({ 
    message: 'GitHub Summarizer API', 
    method: 'GET',
    note: 'POST 요청을 사용하여 GitHub URL과 API 키를 전송하세요.' 
  }), { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// OPTIONS 요청 처리 (CORS 지원)
export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    },
  });
}

export async function POST(req) {
  try {
    console.log('=== GitHub Summarizer API 키 검증 시작 ===');
    
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
    
    // Body 파싱 (한 번만)
    let body = null;
    let githubUrl = null;
    
    try {
      body = await req.json();
      console.log('Body 파싱 성공:', body);
      
      // Body에서 API 키 정보 확인
      if (!user || !apiKey) {
        if (body.user && body.apiKey) {
          user = body.user;
          apiKey = body.apiKey;
          console.log('Body에서 사용자와 API 키 추출:', { user, apiKey });
        }
      }
      
      // GitHub URL 추출
      githubUrl = body.githubUrl;
      if (!githubUrl) {
        return new Response(JSON.stringify({ valid: false, error: 'GitHub URL이 필요합니다.' }), { status: 400 });
      }
      
    } catch (e) {
      console.log('Body 파싱 실패:', e);
      return new Response(JSON.stringify({ valid: false, error: '요청 본문을 파싱할 수 없습니다.' }), { status: 400 });
    }
    
    console.log('최종 추출된 데이터:', { user, apiKey, githubUrl });
    
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

    if (!data || data.length === 0) {
      console.log('일치하는 사용자와 API 키를 찾을 수 없음');
      return new Response(JSON.stringify({ valid: false, error: '유효하지 않은 사용자명 또는 API 키입니다.' }), { status: 401 });
    }

    console.log('유효한 사용자와 API 키 발견:', data[0]);

    // README 내용 가져오기
    const readmeContent = await getReadmeContent(githubUrl);
    if (!readmeContent) {
      return new Response(JSON.stringify({ valid: false, error: 'README.md를 찾을 수 없습니다.' }), { status: 404 });
    }

    // LLM을 사용하여 README 요약
    let summary = null;
    try {
      summary = await summarizeReadmeWithLangChain(readmeContent);
    } catch (summaryError) {
      console.error('LLM 요약 실패:', summaryError);
      // 요약 실패해도 원본 README는 반환
    }

    // 성공 응답 - summary가 있으면 포함, 없으면 null
    const responseData = {
      valid: true,
      url: githubUrl
    };

    // summary가 유효한 객체인 경우에만 포함
    if (summary && typeof summary === 'object') {
      responseData.summary = summary;
      console.log('응답에 summary 포함됨:', Object.keys(summary));
    } else {
      console.log('summary가 유효하지 않음:', summary);
    }

    console.log('최종 응답 키들:', Object.keys(responseData));
    return new Response(JSON.stringify(responseData), { status: 200 });

  } catch (err) {
    console.error('GitHub Summarizer API 오류:', err);
    return new Response(JSON.stringify({ valid: false, error: err.message }), { status: 500 });
  }
}

// GitHub 저장소의 README.md 내용을 가져오는 함수
async function getReadmeContent(githubUrl) {
  try {
    // githubUrl 예시: https://github.com/owner/repo
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/.*)?$/);
    if (!match) {
      throw new Error('유효하지 않은 GitHub 저장소 URL입니다.');
    }
    const owner = match[1];
    const repo = match[2];

    // GitHub API를 통해 README.md의 내용을 가져옵니다.
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    if (!res.ok) {
      throw new Error(`README.md를 가져오는 데 실패했습니다. (status: ${res.status})`);
    }

    // README.md의 원본 텍스트 반환
    const readmeContent = await res.text();
    return readmeContent;
  } catch (err) {
    // 에러 발생 시 null 반환
    return null;
  }
}