'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** 0–100: how far the player is. Lower = black hole bigger/closer */
  playerDistance: number;
  /** 0–1 scalar of how deep into the game we are */
  intensity: number;
}

/**
 * Renders the black hole as a Canvas 2D radial vortex.
 * The hole grows as playerDistance decreases.
 */
export default function BlackHoleVisual({ playerDistance, intensity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      timeRef.current += delta;
      const t = timeRef.current;

      const W = canvas.width;
      const H = canvas.height;

      // Black hole center is always left-center
      const cx = W * 0.12;
      const cy = H * 0.5;

      // Radius grows as player gets closer (distance 0 → radius ~40% screen)
      const maxRadius = Math.min(W, H) * 0.42;
      const minRadius = Math.min(W, H) * 0.06;
      const normalizedDist = Math.max(0, Math.min(playerDistance, 100)) / 100;
      const baseRadius = minRadius + (1 - normalizedDist) * (maxRadius - minRadius);

      // Slight pulsing
      const pulseAmp = baseRadius * 0.03 * (1 + intensity * 0.5);
      const radius = baseRadius + Math.sin(t * 2.5) * pulseAmp;

      ctx.clearRect(0, 0, W, H);

      // ---- Outer accretion disk glow ----
      const diskGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 2.8);
      const alpha1 = 0.18 + intensity * 0.12;
      diskGrad.addColorStop(0, `rgba(120, 40, 200, ${alpha1})`);
      diskGrad.addColorStop(0.3, `rgba(60, 10, 120, ${alpha1 * 0.6})`);
      diskGrad.addColorStop(0.6, `rgba(10, 0, 30, ${alpha1 * 0.3})`);
      diskGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = diskGrad;
      ctx.fill();

      // ---- Swirling accretion arcs ----
      const arcCount = 3;
      for (let i = 0; i < arcCount; i++) {
        const angleOffset = (i / arcCount) * Math.PI * 2 + t * (0.6 + i * 0.15);
        const arcRadius = radius * (1.1 + i * 0.22);
        const arcAlpha = (0.25 - i * 0.06) * (1 + intensity * 0.5);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angleOffset);

        const arcGrad = ctx.createLinearGradient(-arcRadius, 0, arcRadius, 0);
        arcGrad.addColorStop(0, `rgba(180, 80, 255, 0)`);
        arcGrad.addColorStop(0.4, `rgba(180, 80, 255, ${arcAlpha})`);
        arcGrad.addColorStop(0.6, `rgba(100, 200, 255, ${arcAlpha * 0.8})`);
        arcGrad.addColorStop(1, `rgba(100, 200, 255, 0)`);

        ctx.beginPath();
        ctx.ellipse(0, 0, arcRadius, arcRadius * 0.15, 0, 0, Math.PI);
        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = 2 + i;
        ctx.stroke();
        ctx.restore();
      }

      // ---- Event horizon (pure black circle) ----
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // ---- Inner glow ring ----
      const ringGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.1);
      ringGrad.addColorStop(0, 'rgba(0,0,0,0)');
      ringGrad.addColorStop(0.5, `rgba(140, 60, 255, ${0.5 + intensity * 0.3})`);
      ringGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = ringGrad;
      ctx.fill();

      // ---- Gravitational lensing streaks ----
      const streakCount = 8;
      for (let i = 0; i < streakCount; i++) {
        const angle = (i / streakCount) * Math.PI * 2 + t * 0.3;
        const len = radius * (0.5 + Math.sin(t * 1.5 + i) * 0.3);
        const x1 = cx + Math.cos(angle) * radius * 1.05;
        const y1 = cy + Math.sin(angle) * radius * 1.05;
        const x2 = cx + Math.cos(angle) * (radius * 1.05 + len);
        const y2 = cy + Math.sin(angle) * (radius * 1.05 + len);

        const streakAlpha = 0.15 + intensity * 0.1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(160, 100, 255, ${streakAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [playerDistance, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
