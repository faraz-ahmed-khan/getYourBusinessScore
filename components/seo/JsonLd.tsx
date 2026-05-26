import { SITE_URLS } from '@/lib/site-urls';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GetYourBusinessScore.com',
  alternateName: 'GYBS',
  url: SITE_URLS.gybs,
  description:
    'Complete the free business intake and see your Business Readiness Score instantly. National Business Readiness Gateway for the Misconi USA ecosystem.',
  publisher: {
    '@type': 'Organization',
    name: 'Misconi USA',
    url: SITE_URLS.misconiUsa,
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
