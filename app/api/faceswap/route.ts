import { NextRequest, NextResponse } from 'next/server';
import { PAIRINGS } from '@/lib/pairings';

const BASE = 'https://prod.api.market/api/v1/magicapi/faceswap-video-v3';

export async function POST(req: NextRequest) {
  const apiKey = process.env.FACESWAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let parkCode: string, photoUrl: string;
  try {
    ({ parkCode, photoUrl } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!parkCode || !photoUrl) {
    return NextResponse.json({ error: 'parkCode and photoUrl are required' }, { status: 400 });
  }

  const pairing = PAIRINGS.find((p) => p.parkCode === parkCode);
  if (!pairing) {
    return NextResponse.json({ error: 'Unknown parkCode' }, { status: 404 });
  }

  // Validate photoUrl is a real URL
  try {
    const u = new URL(photoUrl);
    if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
  } catch {
    return NextResponse.json({ error: 'photoUrl must be a valid http/https URL' }, { status: 400 });
  }

  // Submit job
  const submitRes = await fetch(`${BASE}/run`, {
    method: 'POST',
    headers: { 'x-api-market-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { swap_image: photoUrl, target_video: pairing.sourceVideoUrl },
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    return NextResponse.json({ error: `FaceSwap API error: ${text}` }, { status: 502 });
  }

  const job = (await submitRes.json()) as { id?: string; status?: string };
  const jobId = job.id;
  if (!jobId) {
    return NextResponse.json({ error: 'No job ID returned' }, { status: 502 });
  }

  // Poll until complete (max 3 minutes)
  const maxAttempts = 36;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(`${BASE}/status/${jobId}`, {
      headers: { 'x-api-market-key': apiKey },
    });
    if (!pollRes.ok) continue;

    const status = (await pollRes.json()) as {
      status?: string;
      output?: { video_url?: string };
    };

    if (status.status === 'COMPLETED' || status.status === 'SUCCESS') {
      const videoUrl = status.output?.video_url;
      if (!videoUrl) {
        return NextResponse.json({ error: 'Job completed but no video URL' }, { status: 502 });
      }
      return NextResponse.json({ videoUrl });
    }

    if (status.status === 'FAILED' || status.status === 'ERROR') {
      return NextResponse.json({ error: 'Face swap job failed. Make sure your photo shows a clear face.' }, { status: 422 });
    }
  }

  return NextResponse.json({ error: 'Job timed out. Please try again.' }, { status: 504 });
}
