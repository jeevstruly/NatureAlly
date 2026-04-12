import { fetchParks } from '@/lib/nps';
import { PAIRINGS } from '@/lib/pairings';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Explore Parks — NaturAlly',
  description: "Browse America's national parks and discover their stories.",
};

export default async function ParksPage() {
  const { data: parks } = await fetchParks(30);
  const pairedCodes = new Set(PAIRINGS.filter((p) => p.videoReady).map((p) => p.parkCode));

  return (
    <div style={{ backgroundColor: 'var(--cream)' }} className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-2xl font-bold tracking-tight"
        >
          Natur<span style={{ color: 'var(--forest-light)' }}>Ally</span>
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <h1
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-4xl font-bold mb-2"
        >
          Explore National Parks
        </h1>
        <p style={{ color: 'var(--stone)' }} className="text-lg mb-10">
          Discover America&apos;s most iconic landscapes and the stories behind them.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park) => (
            <Link
              key={park.parkCode}
              href={`/parks/${park.parkCode}`}
              className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--forest)]"
              style={{ backgroundColor: 'white' }}
            >
              {park.images[0] ? (
                <div className="relative w-full h-48">
                  <Image
                    src={park.images[0].url}
                    alt={park.images[0].altText || `${park.fullName} — park scenery`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-48 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: 'var(--stone-light)' }}
                >
                  🌲
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2
                    style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
                    className="text-lg font-bold leading-snug"
                  >
                    {park.fullName}
                  </h2>
                  {pairedCodes.has(park.parkCode) && (
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--stone-light)', color: 'var(--forest)' }}
                    >
                      Legend
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--stone)' }} className="text-xs mb-2">
                  {park.states}
                </p>
                <p
                  style={{ color: 'var(--stone-dark)' }}
                  className="text-sm leading-relaxed line-clamp-3"
                >
                  {park.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-10 text-center" style={{ color: 'var(--stone)' }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>
    </div>
  );
}
