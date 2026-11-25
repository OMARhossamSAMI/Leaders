import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';
import { bootApp } from './app';
import {
  referencedUploads,
  restoreUploads,
} from '../src/common/restore-uploads';

describe('Uploaded files come back after a deploy', () => {
  let app: INestApplication;
  let db: Connection;
  let dir: string;

  beforeAll(async () => {
    app = await bootApp();
    db = app.get(getConnectionToken());
  });
  afterAll(() => app.close());

  beforeEach(async () => {
    await db.dropDatabase();
    dir = await fs.promises.mkdtemp(join(os.tmpdir(), 'uploads-test-'));
    // The shapes the site stores: application/vacancy files, internship URLs.
    await db.collection('studentapplications').insertMany([
      { files: [{ originalname: 'birth.pdf', path: 'uploads/files-1-111.pdf' }] },
      { files: [{ originalname: 'id.jpg', path: 'uploads/files-2-222.jpg' }] },
    ]);
    await db.collection('vacancies').insertOne({
      files: [{ originalname: 'CV.pdf', path: 'uploads/1753-0711-سيرة ذاتية.pdf' }],
    });
    await db.collection('internships').insertOne({
      cv_file_url: '/uploads/1760-cv.pdf?x=1',
      note: 'mentions uploads/../../etc/passwd',
    });
    await fs.promises.writeFile(join(dir, 'files-1-111.pdf'), 'already here');
  });
  afterEach(() => fs.promises.rm(dir, { recursive: true, force: true }));

  it('finds every file the database points to, and nothing outside the folder', async () => {
    expect(await referencedUploads(db)).toEqual(
      ['1753-0711-سيرة ذاتية.pdf', '1760-cv.pdf', 'files-1-111.pdf', 'files-2-222.jpg'].sort(),
    );
  });

  it('copies the missing files from the old server and keeps the ones it has', async () => {
    const asked: string[] = [];
    const res = await restoreUploads({
      db,
      dir,
      baseUrl: 'https://old.example/',
      log: () => {},
      fetcher: async (url) => {
        asked.push(url);
        if (url.endsWith('1760-cv.pdf')) return { status: 404 };
        return { status: 200, body: Buffer.from(`copy of ${url}`) };
      },
    });
    expect(res).toMatchObject({ referenced: 4, present: 1, restored: 2, notFound: 1, failed: 0 });
    expect(asked).toContain(
      `https://old.example/uploads/${encodeURIComponent('1753-0711-سيرة ذاتية.pdf')}`,
    );
    expect(asked.some((u) => u.endsWith('files-1-111.pdf'))).toBe(false);
    expect(await fs.promises.readFile(join(dir, 'files-1-111.pdf'), 'utf8')).toBe('already here');
    expect(fs.existsSync(join(dir, 'files-2-222.jpg'))).toBe(true);
    expect(fs.existsSync(join(dir, '1753-0711-سيرة ذاتية.pdf'))).toBe(true);
    expect(fs.readdirSync(dir).some((f) => f.startsWith('.restoring-'))).toBe(false);
  });

  it('stops quickly when there is no old server (a plain restart)', async () => {
    await db.collection('studentapplications').insertMany(
      Array.from({ length: 40 }, (_, i) => ({ files: [{ path: `uploads/extra-${i}.pdf` }] })),
    );
    let calls = 0;
    const res = await restoreUploads({
      db,
      dir,
      baseUrl: 'https://old.example',
      log: () => {},
      concurrency: 1,
      fetcher: async () => {
        calls++;
        throw new Error('connect ECONNREFUSED');
      },
    });
    expect(res.stoppedEarly).toBe(true);
    expect(calls).toBe(10);
  });
});
