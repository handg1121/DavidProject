-- 사용자 테이블 완전 새로 생성 스크립트
-- RLS 오류 방지 버전

-- 1. 기존 테이블과 관련 객체들 완전 삭제
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 2. 사용자 테이블 생성 (RLS 비활성화 상태로)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image_url TEXT,
    provider VARCHAR(50) DEFAULT 'google',
    provider_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider_id ON users(provider_id);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 4. updated_at 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. updated_at 자동 업데이트 트리거 생성
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. 테이블 설명 추가
COMMENT ON TABLE users IS 'NextAuth를 통한 소셜 로그인 사용자 정보';
COMMENT ON COLUMN users.id IS '사용자 고유 식별자 (UUID)';
COMMENT ON COLUMN users.email IS '사용자 이메일 주소 (고유)';
COMMENT ON COLUMN users.name IS '사용자 이름';
COMMENT ON COLUMN users.image_url IS '사용자 프로필 이미지 URL';
COMMENT ON COLUMN users.provider IS '인증 제공자 (google, github 등)';
COMMENT ON COLUMN users.provider_id IS '인증 제공자의 사용자 ID';
COMMENT ON COLUMN users.created_at IS '계정 생성 시간';
COMMENT ON COLUMN users.updated_at IS '마지막 업데이트 시간';

-- 7. 테이블 생성 확인
SELECT 'users 테이블이 성공적으로 생성되었습니다.' as status; 