'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { i18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

function readHighscore(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem('th_highscore') || 0);
}

export default function GameOverScreen() {
  const router = useRouter();
  const stats = useGameStore((s) => s.stats);
  const resetGame = useGameStore((s) => s.resetGame);
  const startCountdown = useGameStore((s) => s.startCountdown);
  const language = useGameStore((s) => s.language);
  const t = i18n[language];
  const [highscore] = useState<number>(readHighscore);

  const isNewRecord = stats.score > 0 && stats.score >= highscore;

  const handleMenu = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8 max-w-md w-full px-8">
        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-4xl font-bold text-red-400 tracking-widest uppercase"
            style={{ textShadow: '0 0 30px rgba(239,68,68,0.6)' }}
          >
            {t.consumed}
          </h1>
          <p className="text-slate-500 text-sm">{t.consumedSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Stat label={t.scoreLabel} value={stats.score.toLocaleString()} highlight={isNewRecord} />
          <Stat label={t.survivedLabel} value={`${stats.survivalSeconds}s`} />
          <Stat label={t.wpmLabel} value={String(stats.wpm)} />
          <Stat label={t.accuracyLabel} value={`${stats.accuracy}%`} />
          <Stat label={t.wordsLabel} value={String(stats.wordsCompleted)} />
          <Stat label={t.bestComboLabel} value={`×${stats.bestCombo}`} />
        </div>

        {isNewRecord && (
          <div className="text-yellow-400 text-sm font-bold tracking-widest uppercase animate-pulse">
            {t.newHighScore}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={startCountdown}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
          >
            {t.tryAgain}
          </button>
          <button
            onClick={handleMenu}
            className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 font-bold tracking-widest uppercase text-sm transition-all duration-200"
          >
            {t.menu}
          </button>
        </div>

        <p className="text-xs text-slate-600 text-center">
          {t.localSave}{' '}
          <span className="text-slate-500">
            {t.best}: {highscore.toLocaleString()}
          </span>
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
