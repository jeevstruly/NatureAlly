"use client";

export default function ParksError({ reset }: { reset: () => void }) {
  return (
    <div style={{ backgroundColor: 'var(--cream)' }} className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
      <p style={{ color: 'var(--stone-dark)' }} className="text-lg">
        Could not load parks. The NPS API may be temporarily unavailable.
      </p>
      <button
        onClick={reset}
        style={{ backgroundColor: 'var(--forest)', color: 'white' }}
        className="px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
