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

const FACESWAP_RUN_ENDPOINT =
  'https://prod.api.market/api/v1/magicapi/faceswap-video-v3/run';
const FACESWAP_STATUS_ENDPOINT =
  'https://prod.api.market/api/v1/magicapi/faceswap-video-v3/status';

const OUTPUT_DIR = join(process.cwd(), 'public', 'videos');

async function pollForResult(jobId: string, apiKey: string): Promise<string> {
  const maxAttempts = 30; // 5 minutes at 10s intervals
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 10000));
    const res = await fetch(`${FACESWAP_STATUS_ENDPOINT}/${jobId}`, {
      headers: { 'x-api-market-key': apiKey },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Status check error ${res.status}: ${text}`);
    }
    const json = (await res.json()) as Record<string, unknown>;
    const status = json.status as string | undefined;
    console.log(`  → status: ${status}`);

    if (status === 'COMPLETED' || status === 'SUCCESS') {
      // Response shape: { output: { video_url: "..." } }
      const output = json.output as Record<string, unknown> | undefined;
      const url =
        (output?.video_url as string | undefined) ??
        (json.output_url as string | undefined) ??
        (json.url as string | undefined) ??
        ((json.output as string[] | undefined)?.[0]);
      if (!url) throw new Error(`Job completed but no URL: ${JSON.stringify(json)}`);
      return url;
    }
    if (status === 'FAILED' || status === 'ERROR') {
      throw new Error(`Job failed: ${JSON.stringify(json)}`);
    }
  }
  throw new Error(`Job timed out after ${maxAttempts} attempts`);
}

async function generateVideo(
  faceImageUrl: string,
  sourceVideoUrl: string
): Promise<string> {
  const apiKey = process.env.FACESWAP_API_KEY;
  if (!apiKey) throw new Error('FACESWAP_API_KEY not set in .env.local');

  const res = await fetch(FACESWAP_RUN_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-api-market-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        swap_image: faceImageUrl,
        target_video: sourceVideoUrl,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FaceSwap API error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as Record<string, unknown>;

  // Synchronous response — video URL returned immediately
  const immediate =
    (json.output_url as string | undefined) ??
    (json.url as string | undefined) ??
    (json.video_url as string | undefined) ??
    ((json.output as string[] | undefined)?.[0]);
  if (immediate) return immediate;

  // Async response — poll until complete
  const jobId = json.id as string | undefined;
  if (!jobId) throw new Error(`Unexpected response (no id, no url): ${JSON.stringify(json)}`);

  console.log(`  → job queued: ${jobId}, polling...`);
  return pollForResult(jobId, apiKey);
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
    (p) => !/(\.mp4|\.webm|\.mov|\.avi)(\?|$)/i.test(p.sourceVideoUrl) || p.sourceVideoUrl.includes('view.htm')
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
