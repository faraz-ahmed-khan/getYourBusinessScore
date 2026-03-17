'use client';

import { useRef, useState } from 'react';
import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

/**
 * PACK 8 — Document Upload Pack. Optional.
 * Dummy: file selection UI, send mock metadata to backend; no real storage.
 */
export function Step8Documents({ data, onChange }: Props) {
  const p = data.pack8_documents;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const files = p.uploadedFiles || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < selected.length; i++) {
        formData.append('files', selected[i]);
      }
      const res = await fetch('/api/upload/mock', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success && json.uploadedFiles?.length) {
        const newFiles = json.uploadedFiles.map((f: { name: string }) => ({ name: f.name }));
        onChange({
          pack8_documents: { uploadedFiles: [...files, ...newFiles] },
        });
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onChange({ pack8_documents: { uploadedFiles: next } });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        Upload any documents you want us to review. Examples: PDF, images, statements, licenses, certifications. This step is optional.
      </p>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Upload any documents you want us to review.
        </label>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-2 block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
        />
        {uploading && <p className="mt-1 text-sm text-neutral-500">Uploading…</p>}
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm">
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="ml-2 text-neutral-500 hover:text-red-600 focus:ring-2 focus:ring-primary-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
