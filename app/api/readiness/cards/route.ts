/**
 * Readiness Lifecycle Controller — Level 2 routing.
 * Returns exactly the 3 governed readiness cards. No fourth card; no Review Score card.
 */

import { NextResponse } from 'next/server';
import { READINESS_CARDS } from '@/lib/constants';

export async function GET() {
  const cards = READINESS_CARDS.map((c) => ({
    id: c.id,
    title: c.title,
    destination: c.destination,
    description: c.description,
    ctaText: c.ctaText,
  }));
  return NextResponse.json({ cards });
}
