'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

function readHighscore(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem('th_highscore') || 0);
}

/**
 * Game over overlay showing final stats and restart option.
 */
export default function GameOverScreen() {
  const stats = useGameStore((s) => s.stats);
  const resetGame = useGameStore((s) => s.resetGame);
  const startCountdown = useGameStore((s) => s.startCountdown);
  // Lazy initializer — reads localStorage once, no setState-in-effect
  const [highscore] = useState<number>(readHighscore);

  const isNewRecord = stats.score > 0 && stats.score >= highscore;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 max-w-md w-full px-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-4xl font-bold text-red-400 tracking-widest uppercase"
            style={{ textShadow: '0 0 30px rgba(239,68,68,0.6)' }}
          >
            Consumed
          </h1>
          <p className="text-slate-500 text-sm">The black hole got you.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <Stat label="Score" value={stats.score.toLocaleString()} highlight={isNewRecord} />
          <Stat label="Survived" value={`${stats.survivalSeconds}s`} />
          <Stat label="WPM" value={String(stats.wpm)} />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} />
          <Stat label="Words" value={String(stats.wordsCompleted)} />
          <Stat label="Best Combo" value={`×${stats.bestCombo}`} />
        </div>

        {/* High score notice */}
        {isNewRecord && (
          <div className="text-yellow-400 text-sm font-bold tracking-widest uppercase animate-pulse">
            ★ New High Score! ★
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={startCountdown}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
          >
            Try Again
          </button>
          <button
            onClick={resetGame}
            className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 font-bold tracking-widest uppercase text-sm transition-all duration-200"
          >
            Menu
          </button>
        </div>

        {/* Guest highscore hint */}
        <p className="text-xs text-slate-600 text-center">
          High score saved locally.{' '}
          <span className="text-slate-500">Best: {highscore.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-800">
      <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
      <span
        className={`text-2xl font-bold tabular-nums ${highlight ? 'text-yellow-400' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  );
}
