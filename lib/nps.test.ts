import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchParks, fetchPark, fetchEducationPrograms } from './nps';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockPark = {
  id: '1',
  parkCode: 'yose',
  fullName: 'Yosemite National Park',
  name: 'Yosemite',
  description: 'A famous park.',
  states: 'CA',
  images: [{ url: 'https://example.com/img.jpg', title: 'View', altText: 'Valley', caption: '' }],
  url: 'https://www.nps.gov/yose',
};

describe('fetchParks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns park list on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '1', limit: '20', start: '0', data: [mockPark] }),
    });
    const result = await fetchParks();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].parkCode).toBe('yose');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 });
    await expect(fetchParks()).rejects.toThrow('NPS API error: 403');
  });
});

describe('fetchPark', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the first matching park', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '1', limit: '1', start: '0', data: [mockPark] }),
    });
    const result = await fetchPark('yose');
    expect(result?.fullName).toBe('Yosemite National Park');
  });

  it('returns null when no park matches', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: '0', limit: '1', start: '0', data: [] }),
    });
    const result = await fetchPark('xxxx');
    expect(result).toBeNull();
  });
});

describe('fetchEducationPrograms', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns education programs array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: '1',
        data: [{ id: 'e1', title: 'Junior Ranger', description: 'Learn about the park.', parkCode: 'yose', url: '' }],
      }),
    });
    const result = await fetchEducationPrograms('yose');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Junior Ranger');
  });
});
