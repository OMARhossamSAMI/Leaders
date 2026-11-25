import * as fs from 'fs';
import { basename, join } from 'path';
import type { Connection } from 'mongoose';

/**
 * The server has no disk on Render: every deploy starts from the repo, so
 * the files parents and applicants uploaded (`uploads/`) would be gone.
 *
 * Render keeps the old server answering until the new one opens its port.
 * So before the new server starts listening, it reads from the database
 * which files should exist and downloads the missing ones from the public
 * address, which is still the old server at that moment. After a plain
 * restart there is no old server: the first downloads fail and it stops.
 */

/** Every file name the database points to in uploads/. */
export async function referencedUploads(db: Connection): Promise<string[]> {
  const names = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      const i = v.lastIndexOf('uploads/');
      if (i === -1) return;
      let name = v.slice(i + 'uploads/'.length).split(/[?#]/)[0].trim();
      try {
        name = decodeURIComponent(name);
      } catch {
        /* keep as written */
      }
      // Only plain file names: nothing that could leave the folder.
      if (name && name === basename(name) && name !== '..' && name !== '.') {
        names.add(name);
      }
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === 'object' && !(v instanceof Date)) {
      const ctor = (v as any).constructor?.name;
      if (ctor === 'ObjectId' || ctor === 'Binary' || Buffer.isBuffer(v)) return;
      Object.values(v).forEach(walk);
    }
  };
  const collections = await db.db!.listCollections({}, { nameOnly: true }).toArray();
  for (const { name } of collections) {
    if (name.startsWith('system.')) continue;
    const cursor = db.db!.collection(name).find({});
    for await (const doc of cursor) walk(doc);
  }
  return [...names].sort();
}

export type RestoreResult = {
  referenced: number;
  present: number;
  restored: number;
  notFound: number;
  failed: number;
  stoppedEarly: boolean;
};

type Fetcher = (url: string) => Promise<{ status: number; body?: Buffer }>;

const defaultFetch: Fetcher = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (res.status !== 200) return { status: res.status };
  return { status: 200, body: Buffer.from(await res.arrayBuffer()) };
};

export async function restoreUploads(opts: {
  db: Connection;
  dir: string;
  baseUrl: string;
  fetcher?: Fetcher;
  /** Give up after this long, so the server always starts. */
  budgetMs?: number;
  concurrency?: number;
  log?: (msg: string) => void;
}): Promise<RestoreResult> {
  const fetcher = opts.fetcher ?? defaultFetch;
  const log = opts.log ?? ((m) => console.log(m));
  const deadline = Date.now() + (opts.budgetMs ?? 3 * 60_000);
  const base = opts.baseUrl.replace(/\/+$/, '');

  await fs.promises.mkdir(opts.dir, { recursive: true });
  const names = await referencedUploads(opts.db);
  const missing = names.filter((n) => !fs.existsSync(join(opts.dir, n)));
  const result: RestoreResult = {
    referenced: names.length,
    present: names.length - missing.length,
    restored: 0,
    notFound: 0,
    failed: 0,
    stoppedEarly: false,
  };
  if (!missing.length) return result;
  log(`📦 uploads: ${missing.length} of ${names.length} files missing; copying them from ${base}`);

  let next = 0;
  let firstTries = 0;
  let firstSuccesses = 0;
  const worker = async () => {
    while (next < missing.length && !result.stoppedEarly) {
      if (Date.now() > deadline) {
        result.stoppedEarly = true;
        break;
      }
      const name = missing[next++];
      try {
        const res = await fetcher(`${base}/uploads/${encodeURIComponent(name)}`);
        if (res.status === 200 && res.body) {
          const tmp = join(opts.dir, `.restoring-${process.pid}-${name}`);
          await fs.promises.writeFile(tmp, res.body);
          await fs.promises.rename(tmp, join(opts.dir, name));
          result.restored++;
          firstSuccesses++;
        } else if (res.status === 404) {
          result.notFound++;
        } else {
          result.failed++;
        }
      } catch {
        result.failed++;
      }
      // No old server to copy from (a plain restart): stop quickly.
      if (++firstTries >= 10 && firstSuccesses === 0 && result.failed === firstTries) {
        result.stoppedEarly = true;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.max(1, opts.concurrency ?? 6) }, worker),
  );
  log(
    `📦 uploads: restored ${result.restored}, not on the old server ${result.notFound}, failed ${result.failed}` +
      (result.stoppedEarly ? ' (stopped early)' : ''),
  );
  return result;
}
