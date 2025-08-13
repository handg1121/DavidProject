import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from '../../../../lib/supabase';

// 환경 변수 디버깅
console.log('=== NextAuth 환경 변수 확인 ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '설정됨' : '설정되지 않음');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '설정됨' : '설정되지 않음');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '설정됨' : '설정되지 않음');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('=== signIn 콜백 실행 ===');
      console.log('User:', user?.email);
      console.log('Account provider:', account?.provider);
      
      if (account?.provider === "google") {
        try {
          console.log('Supabase 연결 시도...');
          
          // 사용자가 이미 존재하는지 확인
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', user.email)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('사용자 확인 중 오류:', checkError);
            // Supabase 오류가 있어도 로그인은 허용
            console.log('Supabase 오류가 있지만 로그인 허용');
            return true;
          }

          // 사용자가 존재하지 않으면 새로 생성
          if (!existingUser) {
            console.log('새 사용자 생성 시도...');
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  image_url: user.image,
                  provider: 'google',
                  provider_id: profile.sub,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);

            if (insertError) {
              console.error('사용자 생성 중 오류:', insertError);
              // Supabase 오류가 있어도 로그인은 허용
              console.log('Supabase 오류가 있지만 로그인 허용');
              return true;
            }

            console.log('새 사용자가 Supabase에 저장되었습니다:', user.email);
          } else {
            console.log('기존 사용자 정보 업데이트 시도...');
            // 기존 사용자 정보 업데이트
            const { error: updateError } = await supabase
              .from('users')
              .update({
                name: user.name,
                image_url: user.image,
                updated_at: new Date().toISOString()
              })
              .eq('email', user.email);

            if (updateError) {
              console.error('사용자 업데이트 중 오류:', updateError);
            } else {
              console.log('기존 사용자 정보가 업데이트되었습니다:', user.email);
            }
          }
        } catch (error) {
          console.error('Supabase 작업 중 오류:', error);
          // Supabase 오류가 있어도 로그인은 허용
          console.log('Supabase 오류가 있지만 로그인 허용');
          return true;
        }
      }
      
      console.log('로그인 허용됨');
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 