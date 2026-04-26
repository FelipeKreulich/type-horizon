'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { i18n } from '@/lib/i18n';

/**
 * Full-screen countdown (3, 2, 1, GO!) that plays before the game starts.
 */
export default function CountdownOverlay() {
  const countdownValue = useGameStore((s) => s.countdownValue);
  const setCountdown = useGameStore((s) => s.setCountdown);
  const startGame = useGameStore((s) => s.startGame);
  const language = useGameStore((s) => s.language);
  const t = i18n[language];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (countdownValue <= 0) {
      startGame();
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown(countdownValue - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdownValue, setCountdown, startGame]);

  const label = countdownValue === 0 ? t.go : String(countdownValue);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
      <div
        key={label}
        className="text-9xl font-bold text-white select-none"
        style={{
          textShadow: '0 0 40px rgba(99,179,237,0.8), 0 0 80px rgba(99,179,237,0.4)',
          animation: 'combo-burst 0.5s ease-out',
        }}
      >
        {label}
      </div>
    </div>
  );
}
