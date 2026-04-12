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

export interface NpsParksListResponse {
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

export interface NpsEducationResponse {
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
