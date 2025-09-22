import type { Metadata } from 'next';
import './globals.css';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Providers from '../providers/providers';

import AppBar from '../components/layout/AppBar';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'WEISHUO',
  description: '唯碩公益網',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {/* 避免首屏閃爍 */}
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <Providers>
          <AppBar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
