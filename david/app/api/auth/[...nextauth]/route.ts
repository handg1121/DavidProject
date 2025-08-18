import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 환경 변수 디버깅
console.log('=== NextAuth 환경 변수 확인 ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '설정됨' : '설정되지 않음');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '설정됨' : '설정되지 않음');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '설정됨' : '설정되지 않음');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // pages: {
  //   signIn: "/auth/signin",
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('=== signIn 콜백 실행 ===');
      console.log('User:', user?.email);
      console.log('Account provider:', account?.provider);
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