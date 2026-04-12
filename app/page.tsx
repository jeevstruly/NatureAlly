"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    icon: "🗺️",
    title: "Choose Your Park",
    description: "Browse America's most iconic national parks — from Yellowstone to the Grand Canyon.",
  },
  {
    icon: "🎬",
    title: "Step Into the Story",
    description: "Watch immersive videos where historical figures come to life and guide you through each park's history.",
  },
  {
    icon: "🧑‍🌾",
    title: "Become Part of History",
    description: "Use our face-swap feature to place yourself into iconic historical scenes. You're not just learning — you're there.",
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "var(--cream)" }} className="min-h-screen">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <span
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            color: "var(--forest-dark)",
          }}
          className="text-2xl font-bold tracking-tight"
        >
          Natur<span style={{ color: "var(--forest-light)" }}>Ally</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/parks"
            style={{ color: "var(--forest)" }}
            className="text-sm font-medium hover:underline"
          >
            Explore Parks
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            style={{ backgroundColor: "var(--forest)", color: "white" }}
            className="px-5 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
          >
            Watch Demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          style={{ backgroundColor: "var(--stone-light)", color: "var(--forest)" }}
        >
          🌿 Now in early access
        </div>

        <h1
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            color: "var(--forest-dark)",
          }}
          className="text-5xl sm:text-6xl font-bold leading-tight mb-6"
        >
          Explore National Parks<br />
          <span style={{ color: "var(--forest-light)" }}>Like Never Before</span>
        </h1>

        <p
          style={{ color: "var(--stone)" }}
          className="text-xl leading-relaxed max-w-2xl mx-auto mb-10"
        >
          NaturAlly turns history into experience. Step inside America&apos;s most iconic
          parks through immersive videos — and even place yourself into the story.
        </p>

        <button
          onClick={() => setModalOpen(true)}
          style={{ backgroundColor: "var(--forest)" }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-lg font-semibold transition-opacity hover:opacity-90 shadow-lg"
        >
          <span>▶</span>
          Watch Demo
        </button>

        {/* Hero visual */}
        <div
          className="mt-16 rounded-2xl overflow-hidden shadow-2xl relative mx-auto max-w-3xl"
          style={{ aspectRatio: "16/9", backgroundColor: "var(--forest-dark)" }}
        >
          {/* Simulated park scene */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="text-7xl">🏔️</div>
            <p
              style={{ color: "var(--stone-light)", fontFamily: "var(--font-outfit), Outfit, sans-serif" }}
              className="text-xl font-medium opacity-80"
            >
              Yellowstone National Park
            </p>
            <p style={{ color: "var(--stone-light)" }} className="text-sm opacity-50">
              Est. 1872
            </p>
          </div>
          {/* Play button overlay */}
          <button
            onClick={() => setModalOpen(true)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "2px solid rgba(255,255,255,0.3)" }}
            >
              <span className="text-white text-3xl ml-1">▶</span>
            </div>
          </button>
        </div>
      </section>

      {/* How it works */}
      <section style={{ backgroundColor: "white" }} className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p style={{ color: "var(--forest)" }} className="text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2
              style={{
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                color: "var(--forest-dark)",
              }}
              className="text-4xl font-bold"
            >
              Learning that puts you in the picture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: "var(--stone-light)" }}
                >
                  {step.icon}
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--forest)" }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-outfit), Outfit, sans-serif",
                    color: "var(--forest-dark)",
                  }}
                  className="text-xl font-bold"
                >
                  {step.title}
                </h3>
                <p style={{ color: "var(--stone)" }} className="text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center" style={{ color: "var(--stone)" }}>
        <p className="text-sm">
          © {new Date().getFullYear()} NaturAlly. Built with curiosity and a love for the outdoors.
        </p>
      </footer>

      {/* Demo Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ backgroundColor: "var(--forest-dark)" }}
            >
              <span
                style={{ fontFamily: "var(--font-outfit), Outfit, sans-serif", color: "white" }}
                className="text-lg font-semibold"
              >
                NaturAlly — Demo
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white opacity-70 hover:opacity-100 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Placeholder video */}
            <div
              style={{ aspectRatio: "16/9", backgroundColor: "#0f1f0d" }}
              className="flex flex-col items-center justify-center gap-6 px-8 text-center"
            >
              <div className="text-6xl">🎬</div>
              <p
                style={{
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  color: "var(--stone-light)",
                }}
                className="text-2xl font-bold"
              >
                Demo coming soon
              </p>
              <p style={{ color: "var(--stone)" }} className="text-base max-w-md">
                We&apos;re filming immersive park experiences right now.
                Check back soon — or join the waitlist to be first to see it.
              </p>
              <button
                onClick={() => setModalOpen(false)}
                style={{ borderColor: "var(--forest-light)", color: "var(--forest-light)" }}
                className="mt-2 px-6 py-2.5 rounded-full border font-medium text-sm transition-opacity hover:opacity-80"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
