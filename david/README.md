# David AI Dashboard

Next.js 기반의 AI 대시보드 애플리케이션입니다.

## 기능

- API 키 검증 시스템
- Supabase 연동
- 비디오 재생 기능
- 대시보드 UI
- 알림 시스템

## 설치 및 실행

```bash
npm install
npm run dev
```

## 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 사용법

1. 사이드바에서 "API Playground" 클릭
2. API 키 입력 (예: `test`, `valid_api_key_123`)
3. 유효한 키 입력 시 비디오 재생 페이지로 이동
