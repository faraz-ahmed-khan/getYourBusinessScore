/**
 * Durable gybs-key → Zoho Task id map.
 *
 * Needed because Tasks assigned to Steven are often invisible to the
 * Integration API user (GET/search return 204), so Zoho-side duplicate
 * lookup alone is not enough.
 */

import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), 'data', 'gybs-task-keys.json');

type KeyStore = Record<string, { taskId: string; updatedAt: string }>;

function readStore(): KeyStore {
  try {
    if (!fs.existsSync(STORE_PATH)) return {};
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as KeyStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: KeyStore): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function getStoredTaskId(gybsKey: string): string | null {
  const entry = readStore()[gybsKey];
  return entry?.taskId || null;
}

export function setStoredTaskId(gybsKey: string, taskId: string): void {
  const store = readStore();
  store[gybsKey] = { taskId, updatedAt: new Date().toISOString() };
  writeStore(store);
}

export function clearStoredTaskId(gybsKey: string): void {
  const store = readStore();
  if (!(gybsKey in store)) return;
  delete store[gybsKey];
  writeStore(store);
}
