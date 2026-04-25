'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import GameCanvas from '@/components/GameCanvas';
import CountdownOverlay from '@/components/CountdownOverlay';
import GameOverScreen from '@/components/GameOverScreen';

/**
 * Game route — mounts the canvas and manages overlay state transitions.
 * On mount, starts the countdown immediately.
 */
export default function GamePage() {
  const router = useRouter();
  const gameState = useGameStore((s) => s.gameState);
  const startCountdown = useGameStore((s) => s.startCountdown);

  useEffect(() => {
    // Auto-start countdown when entering the game route
    startCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape key returns to menu during idle/game_over
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (gameState === 'idle' || gameState === 'game_over')) {
        router.push('/');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameState, router]);

  return (
    <div className="relative w-full h-full">
      {/* Base game layer (always rendered — keeps stars/black hole alive) */}
      <GameCanvas />

      {/* Countdown overlay */}
      {gameState === 'countdown' && <CountdownOverlay />}

      {/* Game over overlay */}
      {gameState === 'game_over' && <GameOverScreen />}
    </div>
  );
}
