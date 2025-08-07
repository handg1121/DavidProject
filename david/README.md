# David AI Dashboard

Next.js 기반의 AI 대시보드 애플리케이션입니다.

## 기능

- API 키 검증 시스템
- Supabase 연동
- 비디오 재생 기능
- 대시보드 UI
- 알림 시스템
- GitHub README 요약 기능

## 설치 및 실행

```bash
npm install
npm run dev
```

## 환경 변수 설정

### 1. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI API 키 (GitHub Summarizer 기능에 필요)
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. **Project Settings** → **API**에서 다음 정보 확인:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 입력
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력
3. **Table Editor**에서 `api_keys` 테이블 생성:
   ```sql
   CREATE TABLE api_keys (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     user TEXT NOT NULL,
     key TEXT NOT NULL
   );
   ```

### 3. OpenAI API 키 설정

1. [OpenAI](https://platform.openai.com)에서 API 키 생성
2. `.env.local`의 `OPENAI_API_KEY`에 입력

## 사용법

1. 사이드바에서 "API Playground" 클릭
2. API 키 입력 (예: `test`, `valid_api_key_123`)
3. 유효한 키 입력 시 비디오 재생 페이지로 이동

## API 엔드포인트

### API 키 검증
```
POST /api/validate-api-key
Headers: 
  - Key: user_name
  - Value: api_key_value
```

### GitHub README 요약
```
POST /api/github-summarizer
Headers:
  - Key: user_name  
  - Value: api_key_value
Body:
  {
    "githubUrl": "https://github.com/owner/repo"
  }
```

## 라이센스

MIT License
