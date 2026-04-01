import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gybs: {
          navy: '#1B3A6B',
          blue: '#2E6BE6',
          accent: '#F59E0B',
          success: '#10B981',
          danger: '#EF4444',
          light: '#F8FAFF',
          ink: '#0F172A',
          body: '#334155',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-h1': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-h1-sm': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-h2-sm': ['1.75rem', { lineHeight: '1.25', fontWeight: '700' }],
        'display-h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'display-h3-sm': ['1.25rem', { lineHeight: '1.35', fontWeight: '700' }],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        'gybs-card': '0 2px 12px rgba(0,0,0,0.06)',
        'gybs-card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'gybs-primary': '0 4px 14px rgba(46,107,230,0.3)',
      },
      transitionDuration: {
        gybs: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
