# NaturAlly — API Integration Design

**Date:** 2026-04-12
**Scope:** Integrating NPS Education API and FaceSwap Video V3 into the NaturAlly app

---

## Overview

NaturAlly is an educational platform for the general public to explore national parks. Education is the primary draw; face-swap video is a bonus engagement layer. The app uses two APIs:

- **NPS Education API** — drives all park content at runtime
- **FaceSwap Video V3** — used once at build time to generate a curated video library; not called at runtime

HuggingFace AutoTrain is out of scope for this phase.

---

## Architecture

### Build-Time (one-time, developer-run)

1. A pairings config (`lib/pairings.ts`) defines a curated set of 8–12 park + historical figure combinations.
2. A local script (`scripts/generate-videos.ts`) reads the config, calls FaceSwap V3 once per pairing, and downloads the resulting MP4s.
3. Videos are saved to `/public/videos/[parkCode].mp4` and committed (or uploaded to Vercel Blob / CDN).
4. FaceSwap V3 is never called at runtime. No API key is exposed to users. No per-user cost.

### Runtime

- **NPS Education API** is called server-side via a Next.js API route (`app/api/parks/route.ts`).
- The API route keeps the NPS API key server-side and optionally caches responses to avoid rate limits.
- Pre-generated videos are served as static assets — no processing delay.

---

## Pages

### `/parks` — Park Browser
- Fetches a list of national parks from the NPS API.
- Displays a grid of cards: park name, state, photo, one-line description.
- Cards with a pre-generated face-swap video show a visual badge or indicator.

### `/parks/[parkCode]` — Park Detail
- Fetches full park data from the NPS Education API: history, ecology, significance, media.
- Displays a hero section (image + park name) and an educational content section.
- If a face-swap video exists for the park (`/public/videos/[parkCode].mp4`), renders a "Meet the Legend" section with the video player and a short blurb about the historical figure.
- If no video exists for the park, the "Meet the Legend" section is hidden entirely.

### No auth, no user accounts, no saved state.

---

## Data & Assets

### Pairings Config (`lib/pairings.ts`)
Each entry defines:
- `parkCode` — NPS park code (e.g., `"yose"`)
- `figure` — historical figure name (e.g., `"John Muir"`)
- `figureBlurb` — 1–2 sentence description shown on the detail page
- `sourceVideoUrl` — URL to the NPS park scene video (from NPS public media library)
- `faceImageUrl` — URL or local path to a public domain historical photo of the figure

### Video Sources
- **Park scene videos:** NPS public media library (free, public domain)
- **Historical figure faces:** Public domain historical photographs

### Pre-Generation Script (`scripts/generate-videos.ts`)
- Developer-only tool, not deployed
- Reads pairings config → calls FaceSwap V3 → saves MP4s to `/public/videos/`
- Re-run only when new pairings are added

---

## API Route: `app/api/parks/route.ts`
- Proxies requests to the NPS Education API
- Keeps `NPS_API_KEY` server-side (in `.env.local`)
- Optional: cache responses in-memory or via Next.js `fetch` cache to reduce API calls

---

## Out of Scope
- HuggingFace AutoTrain
- User authentication or accounts
- User-facing face-swap (users inserting themselves)
- On-demand video generation at runtime
- Park search or filtering (can be added later)
