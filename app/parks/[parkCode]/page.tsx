import { fetchPark, fetchEducationPrograms } from '@/lib/nps';
import { PAIRINGS } from '@/lib/pairings';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function ParkDetailPage({
  params,
}: {
  params: Promise<{ parkCode: string }>;
}) {
  const { parkCode } = await params;

  const [parkResult, educationResult] = await Promise.allSettled([
    fetchPark(parkCode),
    fetchEducationPrograms(parkCode),
  ]);

  if (parkResult.status === 'rejected') throw parkResult.reason;
  if (!parkResult.value) return notFound();
  const park = parkResult.value;

  const education = educationResult.status === 'fulfilled' ? educationResult.value : [];
  const pairing = PAIRINGS.find((p) => p.parkCode === parkCode);
  const hasVideo = Boolean(pairing?.videoReady);

  return (
    <div style={{ backgroundColor: 'var(--cream)' }} className="min-h-screen">
      <nav className="flex items-center gap-4 px-8 py-5 max-w-6xl mx-auto">
        <Link
          href="/parks"
          style={{ color: 'var(--forest)' }}
          className="text-sm font-medium hover:underline"
        >
          ← Parks
        </Link>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-2xl font-bold tracking-tight ml-auto"
        >
          Natur<span style={{ color: 'var(--forest-light)' }}>Ally</span>
        </Link>
      </nav>

      {/* Hero image */}
      {park.images[0] && (
        <div className="w-full h-72 md:h-96 overflow-hidden relative">
          <Image
            src={park.images[0].url}
            alt={park.images[0].altText || `${park.fullName} — park scenery`}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
          />
          <div className="absolute bottom-0 left-0 px-8 pb-8 w-full max-w-6xl">
            <h1
              style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
              className="text-4xl md:text-5xl font-bold"
            >
              {park.fullName}
            </h1>
            <p className="text-white opacity-70 text-sm mt-1">{park.states}</p>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Description */}
        <p style={{ color: 'var(--stone-dark)' }} className="text-lg leading-relaxed mb-10">
          {park.description}
        </p>

        {/* Education programs */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2
              style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
              className="text-2xl font-bold mb-6"
            >
              Educational Programs
            </h2>
            <div className="flex flex-col gap-4">
              {education.map((program) => (
                <div key={program.id} className="p-5 rounded-xl" style={{ backgroundColor: 'white' }}>
                  <h3
                    style={{ color: 'var(--forest-dark)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
                    className="font-bold mb-2"
                  >
                    {program.title}
                  </h3>
                  <p style={{ color: 'var(--stone)' }} className="text-sm leading-relaxed">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Meet the Legend */}
        {hasVideo && pairing && (
          <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--forest-dark)' }}>
            <div className="px-8 pt-8 pb-6">
              <p
                style={{ color: 'var(--forest-light)', fontFamily: 'var(--font-outfit), Outfit, sans-serif' }}
                className="text-xs font-semibold uppercase tracking-widest mb-2"
              >
                Meet the Legend
              </p>
              <h2
                style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'white' }}
                className="text-3xl font-bold mb-3"
              >
                {pairing.figure}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-base leading-relaxed">
                {pairing.figureBlurb}
              </p>
            </div>
            <video
              controls
              className="w-full"
              src={`/videos/${parkCode}.mp4`}
              poster={park.images[0]?.url}
              aria-label={`${pairing.figure} at ${park.fullName}`}
            />
          </section>
        )}
      </main>

      <footer className="py-10 text-center" style={{ color: 'var(--stone)' }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>
    </div>
  );
}
