'use client';

import { SessionProvider } from 'next-auth/react';
import ThemeProviders from './ThemeProviders';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProviders>{children}</ThemeProviders>
    </SessionProvider>
  );
}
