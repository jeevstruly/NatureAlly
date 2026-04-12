import { NextResponse } from 'next/server';
import { fetchParks } from '@/lib/nps';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit') ?? '20') || 20));
  const start = Math.max(0, Number(searchParams.get('start') ?? '0') || 0);
  try {
    const data = await fetchParks(limit, start);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch parks' }, { status: 502 });
  }
}
