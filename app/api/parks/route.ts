import { NextResponse } from 'next/server';
import { fetchParks } from '@/lib/nps';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit') ?? '20');
  const start = Number(searchParams.get('start') ?? '0');
  const data = await fetchParks(limit, start);
  return NextResponse.json(data);
}
