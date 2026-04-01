const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GetYourBusinessScore.com',
  alternateName: 'GYBS',
  url: 'https://getyourbusinessscore.com',
  description:
    'Complete the free business intake and see your Business Readiness Score instantly. National Business Readiness Gateway for the Misconi USA ecosystem.',
  publisher: {
    '@type': 'Organization',
    name: 'Misconi USA',
    url: 'https://misconiusa.com',
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
