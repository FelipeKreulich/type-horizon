'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { getDifficulty } from '@/lib/gameLogic';
import BlackHoleVisual from './BlackHoleVisual';
import StarField from './StarField';
import HUD from './HUD';
import TypingInput from './TypingInput';

/**
 * Main game container. Owns the requestAnimationFrame loop and delegates
 * rendering to sub-components. Physics ticks happen here via tickPhysics().
 */
export default function GameCanvas() {
  const gameState = useGameStore((s) => s.gameState);
  const playerDistance = useGameStore((s) => s.playerDistance);
  const playerVelocity = useGameStore((s) => s.playerVelocity);
  const startTime = useGameStore((s) => s.startTime);
  const tickPhysics = useGameStore((s) => s.tickPhysics);

  // lastFrameRef is initialized to 0 and set properly inside useEffect
  const lastFrameRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // elapsed is tracked in state so visuals react without impure calls in render
  const [elapsed, setElapsed] = useState(0);

  // ---- Game loop ----
  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastFrameRef.current = performance.now();

    const loop = (now: number) => {
      const delta = Math.min((now - lastFrameRef.current) / 1000, 0.1);
      lastFrameRef.current = now;
      tickPhysics(delta);

      // Use Date.now() — startTime is also Date.now(), not performance.now()
      if (startTime) {
        setElapsed((Date.now() - startTime) / 1000);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, tickPhysics, startTime]);

  const intensity = getDifficulty(elapsed);

  // Slight "camera" translation: pulls entire UI toward the black hole as distance shrinks
  const pullTranslate = (1 - playerDistance / 100) * -30;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#020408]">
      {/* Layer 0: stars */}
      <StarField velocity={playerVelocity} />

      {/* Layer 1: black hole */}
      <BlackHoleVisual playerDistance={playerDistance} intensity={intensity} />

      {/* Layer 2: HUD */}
      {gameState === 'playing' && <HUD />}

      {/* Layer 3: typing area — shifts subtly with danger */}
      {gameState === 'playing' && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-500"
          style={{ transform: `translateX(${pullTranslate}px)` }}
        >
          <TypingInput />
        </div>
      )}
    </div>
  );
}
