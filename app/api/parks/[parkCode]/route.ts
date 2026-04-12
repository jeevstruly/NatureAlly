import { NextResponse } from 'next/server';
import { fetchPark, fetchEducationPrograms } from '@/lib/nps';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ parkCode: string }> }
) {
  const { parkCode } = await params;
  const [parkResult, educationResult] = await Promise.allSettled([
    fetchPark(parkCode),
    fetchEducationPrograms(parkCode),
  ]);
  if (parkResult.status === 'rejected') {
    return NextResponse.json({ error: 'Failed to fetch park' }, { status: 502 });
  }
  if (!parkResult.value) {
    return NextResponse.json({ error: 'Park not found' }, { status: 404 });
  }
  return NextResponse.json({
    park: parkResult.value,
    education: educationResult.status === 'fulfilled' ? educationResult.value : [],
  });
}
