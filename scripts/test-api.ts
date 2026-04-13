/**
 * Quick test: use the API's own sample face image to verify end-to-end flow.
 * Run with: npx tsx scripts/test-api.ts
 */
import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(process.cwd(), '.env.local') });

async function main() {
  const apiKey = process.env.FACESWAP_API_KEY;
  if (!apiKey) throw new Error('FACESWAP_API_KEY not set');

  console.log('Submitting test job...');
  const res = await fetch('https://prod.api.market/api/v1/magicapi/faceswap-video-v3/run', {
    method: 'POST',
    headers: { 'x-api-market-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: {
        swap_image: 'https://www.intermountainhistories.org/files/fullsize/5fb8a2748927667cabdfa9e7a2e3197b.jpg',
        target_video: 'https://assets.mixkit.co/videos/2213/2213-720.mp4',
      },
    }),
  });

  const json = (await res.json()) as Record<string, unknown>;
  console.log('HTTP status:', res.status);
  console.log('Response:', JSON.stringify(json, null, 2));

  const jobId = json.id as string | undefined;
  if (!jobId) return;

  console.log('\nPolling for result...');
  for (let i = 0; i < 24; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const poll = await fetch(
      `https://prod.api.market/api/v1/magicapi/faceswap-video-v3/status/${jobId}`,
      { headers: { 'x-api-market-key': apiKey } }
    );
    const status = (await poll.json()) as Record<string, unknown>;
    console.log(`[${i + 1}] ${JSON.stringify(status)}`);
    if (['COMPLETED', 'SUCCESS', 'FAILED', 'ERROR'].includes(status.status as string)) break;
  }
}

main();
