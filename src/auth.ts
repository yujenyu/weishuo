import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 登入時會在 Prisma User/Account/Session 表寫資料
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // 第一次登入時把 Google 頭像放進 token
      if (account && profile) {
        token.picture = (profile as any)?.picture ?? token.picture;
      }
      // 可選：確保 token 也能取到 user.id（有 adapter 時 user 會存在第一次登入的回合）
      if (user) {
        (token as any).uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      // 把頭像塞回 session 給前端顯示
      if (session.user) {
        (session.user as any).id = (token as any).uid ?? token.sub; // sub 即 DB user.id（有 adapter）
        session.user.image = (token as any).picture ?? session.user.image;
      }
      return session;
    },
  },
});
