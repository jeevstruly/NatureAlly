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
