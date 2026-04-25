'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// Pre-generate star data once at module level — stable across renders
const STARS = Array.from({ length: 80 }, () => ({
  width: Math.random() * 2 + 0.5,
  height: Math.random() * 2 + 0.5,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.5 + 0.1,
}));

function readHighscore(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem('th_highscore') || 0);
}

/**
 * Landing page — minimal, atmospheric, sends player straight into the game.
 */
export default function HomePage() {
  const router = useRouter();
  // Lazy initializer reads localStorage once on mount — avoids setState-in-effect
  const [highscore] = useState<number>(readHighscore);

  // Stable star list — useMemo prevents re-randomization on re-render
  const stars = useMemo(() => STARS, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020408] overflow-hidden">
      {/* Background gradient vortex hint */}
      <div
        className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(80,20,140,0.25) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Stars (CSS-only, static for landing) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center px-6">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">Typing Survival</p>
          <h1
            className="text-6xl md:text-8xl font-black text-white tracking-tight"
            style={{ textShadow: '0 0 60px rgba(99,179,237,0.3)' }}
          >
            TYPE
          </h1>
          <h2
            className="text-4xl md:text-5xl font-black tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HORIZON
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mt-2">
            A black hole is pulling you in. Type fast to escape. Every word buys you distance.
          </p>
        </div>

        {/* High score */}
        {highscore > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-600 uppercase tracking-widest">Your best</span>
            <span className="text-2xl font-bold text-yellow-400">{highscore.toLocaleString()}</span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => router.push('/game')}
          className="group relative px-12 py-4 rounded-xl text-white font-bold text-lg tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
          }}
        >
          <span className="relative z-10">Play Now</span>
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #6d28d9, #2563eb)',
              boxShadow: '0 0 50px rgba(99,102,241,0.6)',
            }}
          />
        </button>

        {/* Quick instructions */}
        <div className="flex flex-col gap-2 text-xs text-slate-600 max-w-xs">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>
              Type the word and press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Space</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Enter</kbd>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-500">→</span>
            <span>Longer words = more distance boost</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-purple-500">→</span>
            <span>Build combos for speed boosts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-500">→</span>
            <span>Errors pull you toward the void</span>
          </div>
        </div>
      </div>
    </div>
  );
}
