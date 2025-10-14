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
      if (
        account &&
        profile &&
        typeof profile === 'object' &&
        profile !== null
      ) {
        const pic = (profile as { picture?: unknown }).picture;
        if (typeof pic === 'string') {
          // JWT 已內建 picture?: string | null
          token.picture = pic;
        }
      }

      // 保留 user：把 DB user.id 放到自訂 token.uid（第一次登入這回合會有 user）
      if (user && typeof (user as { id?: unknown }).id === 'string') {
        (token as { uid?: string }).uid = (user as { id: string }).id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // 讀回自訂的 uid（若沒有就用 token.sub）
        const t = token as Record<string, unknown>;
        const uid =
          typeof t.uid === 'string'
            ? t.uid
            : typeof token.sub === 'string'
              ? token.sub
              : undefined;
        const picture =
          typeof t.picture === 'string'
            ? (t.picture as string)
            : typeof token.picture === 'string'
              ? token.picture
              : undefined;

        // 在不使用 any 的前提下，局部擴充 session.user 型別以便賦值 id
        const userWithId = session.user as typeof session.user & {
          id?: string;
        };
        if (uid) userWithId.id = uid;

        // 回填頭像（若 session.user.image 尚未有值，或你想覆蓋就移除條件）
        if (picture && !session.user.image) {
          session.user.image = picture;
        }
      }
      return session;
    },
  },
});
