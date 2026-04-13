'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { PAIRINGS, type Pairing } from '@/lib/pairings';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function ExperiencePage() {
  const { parkCode } = useParams<{ parkCode: string }>();
  const router = useRouter();
  const pairing: Pairing | undefined = PAIRINGS.find((p) => p.parkCode === parkCode);

  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [resultUrl, setResultUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pairing) router.replace('/parks');
  }, [pairing, router]);

  if (!pairing) return null;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    setStatus('loading');
    setErrorMsg('');
    setResultUrl('');

    try {
      const res = await fetch('/api/faceswap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkCode, photoUrl: photoUrl.trim() }),
      });

      const data = (await res.json()) as { videoUrl?: string; error?: string };

      if (!res.ok || !data.videoUrl) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setResultUrl(data.videoUrl);
      setStatus('done');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--forest-dark)' }} className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center gap-4 px-8 py-5 max-w-6xl mx-auto">
        <Link
          href={`/parks/${parkCode}`}
          style={{ color: 'var(--forest-light)' }}
          className="text-sm font-medium hover:underline"
        >
          ← Back to park
        </Link>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
          className="text-2xl font-bold tracking-tight ml-auto"
        >
          Natur<span style={{ color: 'var(--forest-light)' }}>Ally</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <p
            style={{ color: 'var(--forest-light)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
            className="text-xs font-semibold uppercase tracking-widest mb-3"
          >
            Meet the Legend
          </p>
          <h1
            style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {pairing.figure}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)' }} className="text-base leading-relaxed max-w-xl mx-auto">
            {pairing.figureBlurb}
          </p>
        </div>

        {/* Pre-generated legend video */}
        <div className="rounded-2xl overflow-hidden mb-14" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <video
            controls
            className="w-full"
            src={`/videos/${parkCode}.mp4`}
            aria-label={`${pairing.figure} face-swap video`}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          <p
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
            className="text-xs uppercase tracking-widest whitespace-nowrap"
          >
            Make it personal
          </p>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Custom face-swap form */}
        <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm text-center mb-6 leading-relaxed">
          Paste a URL to a clear photo of yourself and step into the scene as {pairing.figure}.
        </p>

        <form onSubmit={handleGenerate} className="flex flex-col gap-3 mb-4">
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/your-photo.jpg"
            required
            disabled={status === 'loading'}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none disabled:opacity-50"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading' || !photoUrl.trim()}
            className="w-full rounded-xl px-6 py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{
              backgroundColor: 'var(--forest-light)',
              color: 'white',
              fontFamily: 'var(--font-outfit), Outfit, sans-serif',
            }}
          >
            {status === 'loading' ? 'Generating… this takes about a minute' : 'Generate my version'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.3)' }} className="text-xs text-center">
          Best results with a clear, front-facing photo where your face is well-lit.
        </p>

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="mt-10 text-center">
            <div
              className="inline-block w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--forest-light)', borderTopColor: 'transparent' }}
            />
            <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm mt-3">
              The AI is working its magic…
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div
            className="mt-6 rounded-xl px-5 py-4 text-sm"
            style={{ backgroundColor: 'rgba(220,50,50,0.15)', color: '#f87171' }}
          >
            {errorMsg}
          </div>
        )}

        {/* Result */}
        {status === 'done' && resultUrl && (
          <div ref={resultRef} className="mt-10">
            <p
              style={{ color: 'var(--forest-light)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
              className="text-xs font-semibold uppercase tracking-widest mb-4 text-center"
            >
              Your version
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <video
                controls
                autoPlay
                className="w-full"
                src={resultUrl}
                aria-label="Your personalised face-swap video"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={resultUrl}
                download
                className="inline-block text-sm font-medium hover:underline"
                style={{ color: 'var(--forest-light)' }}
              >
                Download video
              </a>
            </div>
          </div>
        )}
      </main>

      <footer className="py-10 text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>
    </div>
  );
}
