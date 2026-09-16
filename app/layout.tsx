import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Chrome } from '@/components/layout/Chrome';
import { JsonLd } from '@/components/seo/JsonLd';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: {
    default: 'Get Your Business Score',
    template: '%s | Get Your Business Score',
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
    <html lang="en" className={`${ibmPlexSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <JsonLd />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
