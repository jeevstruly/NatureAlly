# NaturAlly API Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a parks browser (`/parks`) and park detail pages (`/parks/[parkCode]`) powered by the NPS Education API, with a pre-generated face-swap video section ("Meet the Legend") on eligible park pages.

**Architecture:** NPS API is called server-side through a Next.js API route proxy. FaceSwap V3 is only invoked by a local developer script at content-creation time — never at runtime. Pre-generated MP4s are committed to `/public/videos/` and served as static assets.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, NPS Developer API, FaceSwap Video V3 (api.market), Vitest for unit tests.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `.env.local.example` | Create | Document required env vars |
| `vitest.config.ts` | Create | Vitest config with `@` alias |
| `package.json` | Modify | Add `test` script and vitest devDep |
| `lib/pairings.ts` | Create | Park + historical figure pairing definitions |
| `lib/nps.ts` | Create | NPS API client (typed fetch functions) |
| `lib/nps.test.ts` | Create | Unit tests for NPS client |
| `app/api/parks/route.ts` | Create | Proxy: NPS parks list |
| `app/api/parks/[parkCode]/route.ts` | Create | Proxy: NPS park detail + education programs |
| `app/page.tsx` | Modify | Add "Explore Parks" nav link |
| `app/parks/page.tsx` | Create | Park browser grid |
| `app/parks/[parkCode]/page.tsx` | Create | Park detail + Meet the Legend section |
| `scripts/generate-videos.ts` | Create | One-time FaceSwap V3 generation script |

---

## Task 1: Environment & Test Setup

**Files:**
- Create: `.env.local.example`
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Create `.env.local.example`**

```
# NPS Developer API key — get one at https://www.nps.gov/subjects/developer/get-started.htm
NPS_API_KEY=DEMO_KEY

# FaceSwap Video V3 API key — get one at https://api.market/store/magicapi/faceswap-video-v3
# Only needed when running scripts/generate-videos.ts locally
FACESWAP_API_KEY=your_faceswap_key_here
```

- [ ] **Step 2: Copy to `.env.local` and fill in your NPS key**

```bash
cp .env.local.example .env.local
# Then open .env.local and replace DEMO_KEY with your real NPS API key
```

- [ ] **Step 3: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 4: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 5: Add test script to `package.json`**

In `package.json`, update the `"scripts"` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

- [ ] **Step 6: Commit**

```bash
git add .env.local.example vitest.config.ts package.json package-lock.json
git commit -m "chore: add env template, vitest setup"
```

---

## Task 2: Pairings Config

**Files:**
- Create: `lib/pairings.ts`

- [ ] **Step 1: Create `lib/pairings.ts`**

```typescript
export interface Pairing {
  parkCode: string;
  figure: string;
  figureBlurb: string;
  /** Direct URL to an NPS or public-domain park scene video used as FaceSwap source */
  sourceVideoUrl: string;
  /** Direct URL to a public-domain photo of the historical figure */
  faceImageUrl: string;
}

export const PAIRINGS: Pairing[] = [
  {
    parkCode: 'yose',
    figure: 'John Muir',
    figureBlurb:
      'Scottish-American naturalist and founder of the Sierra Club who spent years living in Yosemite Valley, whose writings helped establish the national parks system.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=B4A4E5D6-1DD8-B71C-07D3EB16D6FA3EC2',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/John_Muir_by_Carleton_Watkins%2C_c1875.jpg/440px-John_Muir_by_Carleton_Watkins%2C_c1875.jpg',
  },
  {
    parkCode: 'yell',
    figure: 'Theodore Roosevelt',
    figureBlurb:
      'The 26th U.S. President who visited Yellowstone in 1903 and protected over 230 million acres of public land, cementing the national parks legacy.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=51B86F18-1DD8-B71C-0753D4BBF609B12A',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/440px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg',
  },
  {
    parkCode: 'grca',
    figure: 'John Wesley Powell',
    figureBlurb:
      'Civil War veteran and geologist who led the first documented expedition through the Grand Canyon in 1869, mapping the Colorado River and transforming our understanding of the American West.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=60EB1A2A-1DD8-B71C-07D0E7A6D7B1E7C8',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/John_Wesley_Powell_by_Bell%2C_1871.jpg/440px-John_Wesley_Powell_by_Bell%2C_1871.jpg',
  },
  {
    parkCode: 'grte',
    figure: 'Ansel Adams',
    figureBlurb:
      'Iconic American photographer whose black-and-white images of the Grand Tetons helped shape public support for wilderness preservation throughout the 20th century.',
    sourceVideoUrl:
      'https://www.nps.gov/media/video/view.htm?id=7A5C8D3F-1DD8-B71C-07E1A2B3C4D5E6F7',
    faceImageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ansel_Adams_and_camera.jpg/440px-Ansel_Adams_and_camera.jpg',
  },
];
```

> **Note:** The `sourceVideoUrl` values above are illustrative. Before running `scripts/generate-videos.ts`, replace them with real NPS video URLs — browse https://www.nps.gov/media/video/browse.htm or use the NPS multimedia API endpoint `/multimedia/videos?parkCode=yose`.

- [ ] **Step 2: Commit**

```bash
git add lib/pairings.ts
git commit -m "feat: add park/figure pairings config"
```

---

## Task 3: NPS API Client + Tests

**Files:**
- Create: `lib/nps.ts`
- Create: `lib/nps.test.ts`

- [ ] **Step 1: Create `lib/nps.ts`**

```typescript
const NPS_BASE = 'https://developer.nps.gov/api/v1';

export interface NpsPark {
  id: string;
  parkCode: string;
  fullName: string;
  name: string;
  description: string;
  states: string;
  images: Array<{ url: string; title: string; altText: string; caption: string }>;
  url: string;
}

interface NpsParksListResponse {
  total: string;
  limit: string;
  start: string;
  data: NpsPark[];
}

export interface NpsEducationProgram {
  id: string;
  title: string;
  description: string;
  parkCode: string;
  url: string;
}

interface NpsEducationResponse {
  total: string;
  data: NpsEducationProgram[];
}

function apiKey(): string {
  return process.env.NPS_API_KEY ?? 'DEMO_KEY';
}

export async function fetchParks(limit = 20, start = 0): Promise<NpsParksListResponse> {
  const res = await fetch(
    `${NPS_BASE}/parks?limit=${limit}&start=${start}&api_key=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`NPS API error: ${res.status}`);
  return res.json() as Promise<NpsParksListResponse>;
}

export async function fetchPark(parkCode: string): Promise<NpsPark | null> {
  const res = await fetch(
    `${NPS_BASE}/parks?parkCode=${parkCode}&api_key=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`NPS API error: ${res.status}`);
  const data = (await res.json()) as NpsParksListResponse;
  return data.data[0] ?? null;
}

export async function fetchEducationPrograms(parkCode: string): Promise<NpsEducationProgram[]> {
  const res = await fetch(
    `${NPS_BASE}/education/programs?parkCode=${parkCode}&limit=10&api_key=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`NPS API error: ${res.status}`);
  const data = (await res.json()) as NpsEducationResponse;
  return data.data;
}
```

- [ ] **Step 2: Create `lib/nps.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchParks, fetchPark, fetchEducationPrograms } from './nps';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockPark = {
  id: '1',
  parkCode: 'yose',
  fullName: 'Yosemite National Park',
  name: 'Yosemite',
  description: 'A famous park.',
  states: 'CA',
  images: [{ url: 'https://example.com/img.jpg', title: 'View', altText: 'Valley', caption: '' }],
  url: 'https://www.nps.gov/yose',
};

describe('fetchParks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns park list on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '1', limit: '20', start: '0', data: [mockPark] }),
    });
    const result = await fetchParks();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].parkCode).toBe('yose');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });
    await expect(fetchParks()).rejects.toThrow('NPS API error: 403');
  });
});

describe('fetchPark', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the first matching park', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '1', limit: '1', start: '0', data: [mockPark] }),
    });
    const result = await fetchPark('yose');
    expect(result?.fullName).toBe('Yosemite National Park');
  });

  it('returns null when no park matches', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '0', limit: '1', start: '0', data: [] }),
    });
    const result = await fetchPark('xxxx');
    expect(result).toBeNull();
  });
});

describe('fetchEducationPrograms', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns education programs array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: '1',
        data: [{ id: 'e1', title: 'Junior Ranger', description: 'Learn about the park.', parkCode: 'yose', url: '' }],
      }),
    });
    const result = await fetchEducationPrograms('yose');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Junior Ranger');
  });
});
```

- [ ] **Step 3: Run tests — expect all to pass**

```bash
npm test
```

Expected output:
```
✓ lib/nps.test.ts (5 tests)
Test Files  1 passed (1)
Tests       5 passed (5)
```

- [ ] **Step 4: Commit**

```bash
git add lib/nps.ts lib/nps.test.ts vitest.config.ts
git commit -m "feat: add NPS API client with tests"
```

---

## Task 4: Parks List API Route

**Files:**
- Create: `app/api/parks/route.ts`

- [ ] **Step 1: Create `app/api/parks/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { fetchParks } from '@/lib/nps';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '20');
  const start = Number(searchParams.get('start') ?? '0');
  const data = await fetchParks(limit, start);
  return NextResponse.json(data);
}
```

- [ ] **Step 2: Smoke-test with curl**

Start dev server (`npm run dev`) in a separate terminal, then:

```bash
curl "http://localhost:3000/api/parks?limit=3"
```

Expected: JSON with a `data` array of 3 park objects each having `parkCode`, `fullName`, `description`.

- [ ] **Step 3: Commit**

```bash
git add app/api/parks/route.ts
git commit -m "feat: add NPS parks list API route"
```

---

## Task 5: Park Detail API Route

**Files:**
- Create: `app/api/parks/[parkCode]/route.ts`

- [ ] **Step 1: Create directory and file**

Create `app/api/parks/[parkCode]/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { fetchPark, fetchEducationPrograms } from '@/lib/nps';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ parkCode: string }> }
) {
  const { parkCode } = await params;
  const [park, education] = await Promise.all([
    fetchPark(parkCode),
    fetchEducationPrograms(parkCode),
  ]);
  if (!park) {
    return NextResponse.json({ error: 'Park not found' }, { status: 404 });
  }
  return NextResponse.json({ park, education });
}
```

- [ ] **Step 2: Smoke-test with curl**

```bash
curl "http://localhost:3000/api/parks/yose"
```

Expected: JSON with `{ park: { parkCode: "yose", fullName: "Yosemite National Park", ... }, education: [...] }`.

- [ ] **Step 3: Commit**

```bash
git add "app/api/parks/[parkCode]/route.ts"
git commit -m "feat: add NPS park detail API route"
```

---

## Task 6: Add "Explore Parks" Link to Landing Nav

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add Next.js Link import at the top of `app/page.tsx`**

At line 1, before `"use client";` — actually after it. Add the import after the `useState` import:

```typescript
import Link from "next/link";
```

- [ ] **Step 2: Replace the nav `<button>` section in `app/page.tsx`**

Find the nav element (around line 30). Replace:

```tsx
<nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
  <span
    style={{
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      color: "var(--forest-dark)",
    }}
    className="text-2xl font-bold tracking-tight"
  >
    Natur<span style={{ color: "var(--forest-light)" }}>Ally</span>
  </span>
  <button
    onClick={() => setModalOpen(true)}
    style={{ backgroundColor: "var(--forest)", color: "white" }}
    className="px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
  >
    Watch Demo
  </button>
</nav>
```

With:

```tsx
<nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
  <span
    style={{
      fontFamily: "var(--font-outfit), Outfit, sans-serif",
      color: "var(--forest-dark)",
    }}
    className="text-2xl font-bold tracking-tight"
  >
    Natur<span style={{ color: "var(--forest-light)" }}>Ally</span>
  </span>
  <div className="flex items-center gap-4">
    <Link
      href="/parks"
      style={{ color: "var(--forest)" }}
      className="text-sm font-medium hover:underline"
    >
      Explore Parks
    </Link>
    <button
      onClick={() => setModalOpen(true)}
      style={{ backgroundColor: "var(--forest)", color: "white" }}
      className="px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
    >
      Watch Demo
    </button>
  </div>
</nav>
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`. Confirm "Explore Parks" link appears in the nav and clicking it navigates to `/parks` (will show 404 until Task 7 — that's expected).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add Explore Parks nav link to landing page"
```

---

## Task 7: Park Browser Page

**Files:**
- Create: `app/parks/page.tsx`

- [ ] **Step 1: Create `app/parks/page.tsx`**

```typescript
import { fetchParks } from '@/lib/nps';
import { PAIRINGS } from '@/lib/pairings';
import Link from 'next/link';

export const metadata = {
  title: 'Explore Parks — NaturAlly',
  description: "Browse America's national parks and discover their stories.",
};

export default async function ParksPage() {
  const { data: parks } = await fetchParks(30);
  const pairedCodes = new Set(PAIRINGS.map((p) => p.parkCode));

  return (
    <div style={{ backgroundColor: 'var(--cream)' }} className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-2xl font-bold tracking-tight"
        >
          Natur<span style={{ color: 'var(--forest-light)' }}>Ally</span>
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <h1
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-4xl font-bold mb-2"
        >
          Explore National Parks
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-lg mb-10">
          Discover America&apos;s most iconic landscapes and the stories behind them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park) => (
            <Link
              key={park.parkCode}
              href={`/parks/${park.parkCode}`}
              className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              style={{ backgroundColor: 'white' }}
            >
              {park.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={park.images[0].url}
                  alt={park.images[0].altText}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div
                  className="w-full h-48 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: 'var(--stone-light)' }}
                >
                  🌲
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2
                    style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
                    className="text-lg font-bold leading-snug"
                  >
                    {park.fullName}
                  </h2>
                  {pairedCodes.has(park.parkCode) && (
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--stone-light)', color: 'var(--forest)' }}
                    >
                      Legend
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--stone)' }} className="text-xs mb-2">
                  {park.states}
                </p>
                <p
                  style={{ color: 'var(--stone-dark)' }}
                  className="text-sm leading-relaxed line-clamp-3"
                >
                  {park.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-10 text-center" style={{ color: 'var(--stone)' }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/parks`. You should see a grid of park cards. Parks in the pairings config (yose, yell, grca, grte) should show a "Legend" badge.

- [ ] **Step 3: Commit**

```bash
git add app/parks/page.tsx
git commit -m "feat: add park browser page (/parks)"
```

---

## Task 8: Park Detail Page

**Files:**
- Create: `app/parks/[parkCode]/page.tsx`

- [ ] **Step 1: Create `app/parks/[parkCode]/page.tsx`**

```typescript
import { fetchPark, fetchEducationPrograms } from '@/lib/nps';
import { PAIRINGS } from '@/lib/pairings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { existsSync } from 'fs';
import { join } from 'path';

export default async function ParkDetailPage({
  params,
}: {
  params: Promise<{ parkCode: string }>;
}) {
  const { parkCode } = await params;

  const [park, education] = await Promise.all([
    fetchPark(parkCode),
    fetchEducationPrograms(parkCode),
  ]);

  if (!park) notFound();

  const pairing = PAIRINGS.find((p) => p.parkCode === parkCode);
  const videoPath = join(process.cwd(), 'public', 'videos', `${parkCode}.mp4`);
  const hasVideo = Boolean(pairing) && existsSync(videoPath);

  return (
    <div style={{ backgroundColor: 'var(--cream)' }} className="min-h-screen">
      <nav className="flex items-center gap-4 px-8 py-5 max-w-6xl mx-auto">
        <Link
          href="/parks"
          style={{ color: 'var(--forest)' }}
          className="text-sm font-medium hover:underline"
        >
          ← Parks
        </Link>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-2xl font-bold tracking-tight ml-auto"
        >
          Natur<span style={{ color: 'var(--forest-light)' }}>Ally</span>
        </Link>
      </nav>

      {/* Hero image */}
      {park.images[0] && (
        <div className="w-full h-72 md:h-96 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={park.images[0].url}
            alt={park.images[0].altText}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-0 left-0 px-8 pb-8 w-full max-w-6xl">
            <h1
              style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
              className="text-4xl md:text-5xl font-bold"
            >
              {park.fullName}
            </h1>
            <p className="text-white opacity-70 text-sm mt-1">{park.states}</p>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Description */}
        <p style={{ color: 'var(--stone-dark)' }} className="text-lg leading-relaxed mb-10">
          {park.description}
        </p>

        {/* Education programs */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2
              style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
              className="text-2xl font-bold mb-6"
            >
              Educational Programs
            </h2>
            <div className="flex flex-col gap-4">
              {education.map((program) => (
                <div key={program.id} className="p-5 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <h3
                    style={{ color: 'var(--forest-dark)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
                    className="font-bold mb-2"
                  >
                    {program.title}
                  </h3>
                  <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Meet the Legend */}
        {hasVideo && pairing && (
          <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--forest-dark)' }}>
            <div className="px-8 pt-8 pb-6">
              <p
                style={{ color: 'var(--forest-light)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
                className="text-xs font-semibold uppercase tracking-widest mb-2"
              >
                Meet the Legend
              </p>
              <h2
                style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
                className="text-3xl font-bold mb-3"
              >
                {pairing.figure}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-base leading-relaxed">
                {pairing.figureBlurb}
              </p>
            </div>
            <video
              controls
              className="w-full"
              src={`/videos/${parkCode}.mp4`}
              poster={park.images[0]?.url}
            />
          </section>
        )}
      </main>

      <footer className="py-10 text-center" style={{ color: 'var(--stone)' }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser — no video yet**

Open `http://localhost:3000/parks/yose`. You should see:
- Hero image from NPS
- Park description
- Education programs list (if any returned by NPS API)
- No "Meet the Legend" section (no video file yet — that comes in Task 9)

Open `http://localhost:3000/parks/zzzz` — should show Next.js 404 page.

- [ ] **Step 3: Commit**

```bash
git add "app/parks/[parkCode]/page.tsx"
git commit -m "feat: add park detail page with Meet the Legend section"
```

---

## Task 9: Video Generation Script

**Files:**
- Create: `scripts/generate-videos.ts`
- Modify: `package.json`

> **Before running this script:** Verify the FaceSwap V3 API endpoint and request/response format at https://api.market/store/magicapi/faceswap-video-v3. The script below uses the endpoint pattern documented at time of writing — update `FACESWAP_ENDPOINT` and the request body if the API has changed.

- [ ] **Step 1: Install `tsx` for running TypeScript scripts**

```bash
npm install -D tsx
```

- [ ] **Step 2: Add generate script to `package.json`**

Add to the `"scripts"` block in `package.json`:

```json
"generate:videos": "tsx scripts/generate-videos.ts"
```

- [ ] **Step 3: Create `scripts/generate-videos.ts`**

```typescript
/**
 * One-time developer script to generate face-swap videos for all pairings.
 * Run with: npm run generate:videos
 *
 * Requires: FACESWAP_API_KEY in .env.local
 * Output: public/videos/[parkCode].mp4
 *
 * Re-run only when you add new pairings to lib/pairings.ts.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { PAIRINGS } from '../lib/pairings';

// Load .env.local manually (tsx doesn't auto-load it)
import { config } from 'dotenv';
config({ path: join(process.cwd(), '.env.local') });

const FACESWAP_ENDPOINT =
  'https://api.magicapi.dev/api/v1/magicapi/faceswap-video-v3/faceswap/get-video';

const OUTPUT_DIR = join(process.cwd(), 'public', 'videos');

async function generateVideo(
  faceImageUrl: string,
  sourceVideoUrl: string
): Promise<string> {
  const apiKey = process.env.FACESWAP_API_KEY;
  if (!apiKey) throw new Error('FACESWAP_API_KEY not set in .env.local');

  const res = await fetch(FACESWAP_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-magicapi-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      face_url: faceImageUrl,
      video_url: sourceVideoUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FaceSwap API error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { output_url?: string; url?: string; video_url?: string };
  const videoUrl = json.output_url ?? json.url ?? json.video_url;
  if (!videoUrl) throw new Error(`No video URL in response: ${JSON.stringify(json)}`);
  return videoUrl;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const pairing of PAIRINGS) {
    const destPath = join(OUTPUT_DIR, `${pairing.parkCode}.mp4`);

    if (existsSync(destPath)) {
      console.log(`[skip] ${pairing.parkCode}.mp4 already exists`);
      continue;
    }

    console.log(`[generate] ${pairing.parkCode} — ${pairing.figure}`);
    try {
      const videoUrl = await generateVideo(pairing.faceImageUrl, pairing.sourceVideoUrl);
      console.log(`  → got video URL: ${videoUrl}`);
      await downloadFile(videoUrl, destPath);
      console.log(`  → saved to public/videos/${pairing.parkCode}.mp4`);
    } catch (err) {
      console.error(`  ✗ failed for ${pairing.parkCode}:`, err);
    }
  }

  console.log('\nDone. Commit the generated videos:');
  console.log('  git add public/videos/ && git commit -m "feat: add face-swap video library"');
}

main();
```

- [ ] **Step 4: Install dotenv (needed by the script)**

```bash
npm install dotenv
```

- [ ] **Step 5: Run the script (when ready with real API keys and video URLs)**

```bash
npm run generate:videos
```

Expected output per pairing:
```
[generate] yose — John Muir
  → got video URL: https://...
  → saved to public/videos/yose.mp4
```

- [ ] **Step 6: Verify the Meet the Legend section**

After videos are generated, open `http://localhost:3000/parks/yose`. The "Meet the Legend" section should now appear at the bottom with the face-swap video and John Muir's blurb.

- [ ] **Step 7: Commit the script and any generated videos**

```bash
git add scripts/generate-videos.ts package.json package-lock.json
# If you have generated videos:
# git add public/videos/
git commit -m "feat: add video generation script"
```

---

## Self-Review Notes

- All spec requirements are covered: NPS API proxy (Tasks 4–5), park browser (Task 7), park detail with conditional Meet the Legend (Task 8), pre-generation script (Task 9), pairings config (Task 2).
- `PAIRINGS`, `Pairing`, `NpsPark`, `NpsEducationProgram`, `fetchParks`, `fetchPark`, `fetchEducationPrograms` — all defined in Task 2–3 and used consistently in Tasks 4–9.
- `params` in Next.js 16 App Router is a `Promise<{...}>` — awaited correctly in Tasks 5 and 8.
- The "Meet the Legend" section is hidden if no video file exists on disk — `hasVideo` boolean guards the JSX block.
- FaceSwap V3 is never imported or called at runtime — only in `scripts/generate-videos.ts`.
