import { fetchParks, fetchParksByCodes } from '@/lib/nps';
import { PAIRINGS } from '@/lib/pairings';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Explore Parks — NaturAlly',
  description: "Browse America's national parks and discover their stories.",
};

export default async function ParksPage() {
  const pairedCodes = PAIRINGS.filter((p) => p.videoReady).map((p) => p.parkCode);
  const pairedCodesSet = new Set(pairedCodes);

  const [featuredParks, { data: allParks }] = await Promise.all([
    fetchParksByCodes(pairedCodes),
    fetchParks(30),
  ]);

  // Sort featured parks to match PAIRINGS order
  const featuredSorted = pairedCodes
    .map((code) => featuredParks.find((p) => p.parkCode === code))
    .filter(Boolean) as typeof featuredParks;

  // General list excludes the featured parks
  const generalParks = allParks.filter((p) => !pairedCodesSet.has(p.parkCode));

  function ParkCard({ park, featured = false }: { park: (typeof featuredParks)[0]; featured?: boolean }) {
    return (
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
            {featured && (
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
    );
  }

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

        {/* Featured: parks with Legend videos */}
        <h2
          style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--forest-dark)' }}
          className="text-xl font-bold mb-4"
        >
          Featured Parks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {featuredSorted.map((park) => (
            <ParkCard key={park.parkCode} park={park} featured />
          ))}
        </div>

        {/* General parks */}
        {generalParks.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone-light)' }} />
              <h2
                style={{ fontFamily: 'var(--font-outfit), Outfit, sans-serif', color: 'var(--stone)' }}
                className="text-sm font-semibold uppercase tracking-widest whitespace-nowrap"
              >
                More Parks
              </h2>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone-light)' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalParks.map((park) => (
                <ParkCard key={park.parkCode} park={park} />
              ))}
            </div>
          </>
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
