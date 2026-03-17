import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Get Your Business Score | GYBS',
  description: 'Business-only readiness scoring kiosk for the Misconi USA ecosystem. Diagnostic entry point.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
