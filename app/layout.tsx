import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'GetYourBusinessScore.com — Business Readiness Score & Assessment',
    template: '%s | GetYourBusinessScore.com',
  },
  description: 'Complete the free business intake and see your Business Readiness Score instantly.',
  keywords: [
    'business readiness',
    'business readiness score',
    'business intake',
    'readiness assessment',
    'Misconi USA',
    'GYBS',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <JsonLd />
        <Navbar />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
