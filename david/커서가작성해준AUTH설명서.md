# 환경 변수 설정 가이드

## 1. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 2. NEXTAUTH_SECRET 생성

터미널에서 다음 명령어를 실행하여 시크릿 키를 생성하세요:

```bash
openssl rand -base64 32
```

또는 온라인에서 랜덤 문자열을 생성하여 사용하세요.

## 3. Google Cloud Console 설정

### 3.1 Google Cloud 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 3.2 OAuth 동의 화면 설정
1. "API 및 서비스" > "OAuth 동의 화면"으로 이동
2. 사용자 유형 선택 (외부 또는 내부)
3. 앱 정보 입력:
   - 앱 이름
   - 사용자 지원 이메일
   - 개발자 연락처 정보

### 3.3 OAuth 2.0 클라이언트 ID 생성
1. "API 및 서비스" > "사용자 인증 정보"로 이동
2. "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
3. 애플리케이션 유형: "웹 애플리케이션" 선택
4. 승인된 리디렉션 URI 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발용)
   - `https://yourdomain.com/api/auth/callback/google` (프로덕션용)

### 3.4 클라이언트 ID와 시크릿 복사
생성된 클라이언트 ID와 클라이언트 시크릿을 `.env.local` 파일에 입력하세요.

## 4. Google+ API 활성화 (필요한 경우)
1. "API 및 서비스" > "라이브러리"로 이동
2. "Google+ API" 검색 및 활성화

## 5. 개발 서버 실행

```bash
yarn dev
```

이제 `http://localhost:3000`에서 구글 로그인 기능을 테스트할 수 있습니다. 