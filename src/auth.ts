import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 第一次登入時把 Google 頭像放進 token
      if (account && profile) {
        token.picture = (profile as any)?.picture ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // 把頭像塞回 session 給前端顯示
      if (session.user) {
        session.user.image = (token as any).picture ?? session.user.image;
      }
      return session;
    },
  },
});
