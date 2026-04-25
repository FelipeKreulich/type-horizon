'use client';

import { useGameStore } from '@/store/useGameStore';

/**
 * Heads-up display showing live stats during gameplay.
 */
export default function HUD() {
  const stats = useGameStore((s) => s.stats);
  const playerDistance = useGameStore((s) => s.playerDistance);

  const dangerLevel = 1 - playerDistance / 100;
  const dangerColor =
    dangerLevel > 0.75
      ? 'text-red-400'
      : dangerLevel > 0.5
        ? 'text-orange-400'
        : dangerLevel > 0.25
          ? 'text-yellow-400'
          : 'text-emerald-400';

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-20"
      style={{ background: 'linear-gradient(to bottom, rgba(2,4,8,0.8) 0%, transparent 100%)' }}
    >
      {/* Left: survival & score */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-slate-500 uppercase tracking-widest">Score</span>
        <span className="text-xl font-bold text-white tabular-nums">
          {stats.score.toLocaleString()}
        </span>
        <span className="text-xs text-slate-400">{stats.survivalSeconds}s survived</span>
      </div>

      {/* Center: danger meter */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-slate-500 uppercase tracking-widest">Distance</span>
        <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${playerDistance}%`,
              background:
                dangerLevel > 0.6
                  ? 'linear-gradient(to right, #ef4444, #f97316)'
                  : 'linear-gradient(to right, #10b981, #3b82f6)',
            }}
          />
        </div>
        <span className={`text-xs font-mono ${dangerColor}`}>
          {Math.round(playerDistance)}u away
        </span>
      </div>

      {/* Right: WPM + accuracy + combo */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">WPM</span>
            <span className="text-lg font-bold text-blue-300 tabular-nums">{stats.wpm}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Acc</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                stats.accuracy >= 90
                  ? 'text-emerald-400'
                  : stats.accuracy >= 70
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {stats.accuracy}%
            </span>
          </div>
        </div>
        {stats.combo >= 3 && (
          <span className="text-xs font-bold text-purple-300 combo-burst">
            x{stats.combo} COMBO
          </span>
        )}
      </div>
    </div>
  );
}
