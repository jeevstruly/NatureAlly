/**
 * One-time developer script to generate face-swap videos for all pairings.
 * Run with: npm run generate:videos
 *
 * Requires: FACESWAP_API_KEY in .env.local
 * Output: public/videos/[parkCode].mp4
 *
 * Re-run only when you add new pairings to lib/pairings.ts.
 * After running, set videoReady: true on each generated pairing in lib/pairings.ts.
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
  // Pre-flight: verify all source video URLs are direct file URLs
  const invalidPairings = PAIRINGS.filter(
    (p) => !p.sourceVideoUrl.includes('.mp4') || p.sourceVideoUrl.includes('view.htm')
  );
  if (invalidPairings.length > 0) {
    console.error('[abort] Some pairings have invalid sourceVideoUrl values (must be direct .mp4 URLs):');
    for (const p of invalidPairings) {
      console.error(`  ${p.parkCode}: ${p.sourceVideoUrl}`);
      console.error(`  → Find a direct URL at: https://developer.nps.gov/api/v1/multimedia/videos?parkCode=${p.parkCode}`);
    }
    process.exit(1);
  }

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

  console.log('\nDone. After verifying videos:');
  console.log('  1. Set videoReady: true for each successful pairing in lib/pairings.ts');
  console.log('  2. git add public/videos/ lib/pairings.ts && git commit -m "feat: add face-swap video library"');
}

main();
