'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

/**
 * Main typing area: displays current word with live character highlighting
 * and handles input. Triggers screen shake on error, glow on correct word.
 */
export default function TypingInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentWord = useGameStore((s) => s.currentWord);
  const inputValue = useGameStore((s) => s.inputValue);
  const isShaking = useGameStore((s) => s.isShaking);
  const isGlowing = useGameStore((s) => s.isGlowing);
  const isComboActive = useGameStore((s) => s.isComboActive);
  const combo = useGameStore((s) => s.stats.combo);
  const setInput = useGameStore((s) => s.setInput);
  const submitWord = useGameStore((s) => s.submitWord);
  const gameState = useGameStore((s) => s.gameState);

  // Keep focus on the input throughout the game
  useEffect(() => {
    if (gameState === 'playing') {
      inputRef.current?.focus();
    }
  }, [gameState, currentWord]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [setInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        submitWord();
      }
    },
    [submitWord]
  );

  // Render each character with live highlighting
  const renderWord = () => {
    return currentWord.split('').map((char, i) => {
      let colorClass = 'text-slate-600'; // not yet typed
      if (i < inputValue.length) {
        colorClass = inputValue[i] === char ? 'text-emerald-400' : 'text-red-500 line-through';
      } else if (i === inputValue.length) {
        colorClass = 'text-white'; // cursor position
      }
      return (
        <span key={i} className={`${colorClass} transition-colors duration-75`}>
          {char}
        </span>
      );
    });
  };

  const shakeClass = isShaking ? 'shake' : '';
  const glowClass = isGlowing ? 'pulse-glow' : '';
  const comboClass = isComboActive && combo >= 3 ? 'combo-burst' : '';

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-col items-center gap-6 z-20 ${shakeClass}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Word display */}
      <div className={`text-5xl font-bold tracking-widest select-none ${comboClass}`}>
        {renderWord()}
        {/* Blinking cursor */}
        <span className="animate-pulse text-blue-400">|</span>
      </div>

      {/* Ghost preview of typed text */}
      <div className="text-sm text-slate-500 font-mono min-h-[1.25rem]">
        {inputValue || <span className="opacity-40">start typing…</span>}
      </div>

      {/* Invisible input — captures all keypresses */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`
          w-64 px-4 py-3 rounded-lg text-center text-lg font-mono
          bg-slate-900/60 border text-slate-100
          outline-none transition-all duration-200
          ${glowClass}
          ${isShaking ? 'border-red-500/70' : isGlowing ? 'border-emerald-500/70' : 'border-slate-700/60'}
          focus:border-blue-500/60
        `}
        placeholder="type here…"
      />

      {/* Combo indicator */}
      {combo >= 5 && (
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-purple-400 animate-ping"
            style={{ animationDuration: '0.8s' }}
          />
          <span className="text-xs text-purple-300 tracking-widest uppercase font-bold">
            {combo >= 15 ? 'GODLIKE' : combo >= 10 ? 'LEGENDARY' : combo >= 5 ? 'ON FIRE' : ''} ×
            {combo}
          </span>
          <div
            className="w-2 h-2 rounded-full bg-purple-400 animate-ping"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
      )}
    </div>
  );
}
