import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [Google],
  // 需要客製登入頁可加 pages: { signIn: '/login' }
} satisfies NextAuthConfig;
