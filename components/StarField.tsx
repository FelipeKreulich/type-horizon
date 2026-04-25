'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Props {
  /** Player velocity — positive = stars move faster (escaping) */
  velocity: number;
}

const STAR_COUNT = 180;

/**
 * Parallax starfield that reacts to player velocity.
 * Stars move from right to left; faster when escaping, slower when pulled.
 */
export default function StarField({ velocity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const velocityRef = useRef(velocity);

  // Keep velocity ref in sync without restarting the loop
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

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

    // Initialize stars
    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const vel = velocityRef.current;

      ctx.clearRect(0, 0, W, H);

      for (const star of starsRef.current) {
        // Velocity drives parallax: positive vel = moving right, stars go left
        const speedFactor = 1 + Math.max(vel * 0.4, -0.8);
        star.x -= star.speed * speedFactor;

        if (star.x < 0) {
          star.x = W;
          star.y = Math.random() * H;
        }

        // Subtle twinkle
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(0.9, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${star.opacity})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
