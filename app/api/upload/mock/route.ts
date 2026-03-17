/**
 * Document Upload Pack — mock only.
 * Accepts file metadata or formData; returns mock uploaded files. No real storage.
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let names: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      names = files.map((f) => f.name || 'unknown');
    } else {
      const body = await request.json().catch(() => ({}));
      const files = (body.files as { name?: string }[]) || (body.fileNames as string[]);
      if (Array.isArray(files))
        names = files.map((f) => (typeof f === 'string' ? f : f?.name || 'unknown'));
    }

    const uploadedFiles = names.length ? names.map((name) => ({ name, uploadedAt: new Date().toISOString() })) : [];

    return NextResponse.json({
      success: true,
      uploadedFiles,
    });
  } catch {
    return NextResponse.json({ success: false, uploadedFiles: [] }, { status: 400 });
  }
}
