'use client';

import { create } from 'zustand';
import { getNextWord, getWordDistanceBoost } from '@/lib/wordGenerator';
import {
  calculateWPM,
  calculateAccuracy,
  calculateScore,
  getBlackHolePull,
  getWordPushForce,
  getDifficulty,
} from '@/lib/gameLogic';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GameState = 'idle' | 'countdown' | 'playing' | 'game_over';

export interface GameStats {
  wpm: number;
  accuracy: number;
  score: number;
  survivalSeconds: number;
  wordsCompleted: number;
  errorCount: number;
  combo: number;
  bestCombo: number;
}

interface GameStore {
  // --- state ---
  gameState: GameState;
  currentWord: string;
  inputValue: string;

  // --- physics ---
  // player distance from black hole (units). 0 = consumed
  playerDistance: number;
  // velocity: positive = moving away, negative = being pulled
  playerVelocity: number;

  // --- stats ---
  stats: GameStats;
  startTime: number | null;
  totalCharsTyped: number;
  correctCharsTyped: number;
  countdownValue: number;

  // --- feedback flags (toggled briefly) ---
  isShaking: boolean;
  isGlowing: boolean;
  isComboActive: boolean;

  // --- actions ---
  startCountdown: () => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  setInput: (value: string) => void;
  submitWord: () => void;
  tickPhysics: (delta: number) => void;
  setCountdown: (value: number) => void;
  setShaking: (v: boolean) => void;
  setGlowing: (v: boolean) => void;
}

// ---------------------------------------------------------------------------
// Initial values
// ---------------------------------------------------------------------------

const INITIAL_DISTANCE = 55;
const GAME_OVER_DISTANCE = 0;
const WRONG_CHAR_PENALTY = 2.5; // distance units lost per wrong character typed
const WRONG_WORD_PENALTY = 10; // distance units lost when submitting a wrong word

function initialStats(): GameStats {
  return {
    wpm: 0,
    accuracy: 100,
    score: 0,
    survivalSeconds: 0,
    wordsCompleted: 0,
    errorCount: 0,
    combo: 0,
    bestCombo: 0,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'idle',
  currentWord: getNextWord(0),
  inputValue: '',

  playerDistance: INITIAL_DISTANCE,
  playerVelocity: 0,

  stats: initialStats(),
  startTime: null,
  totalCharsTyped: 0,
  correctCharsTyped: 0,
  countdownValue: 3,

  isShaking: false,
  isGlowing: false,
  isComboActive: false,

  // -----------------------------------------------------------------------
  startCountdown: () => {
    set({
      gameState: 'countdown',
      countdownValue: 3,
      currentWord: getNextWord(0),
      inputValue: '',
      playerDistance: INITIAL_DISTANCE,
      playerVelocity: 0,
      stats: initialStats(),
      startTime: null,
      totalCharsTyped: 0,
      correctCharsTyped: 0,
    });
  },

  setCountdown: (value) => set({ countdownValue: value }),

  startGame: () => {
    set({
      gameState: 'playing',
      startTime: Date.now(),
    });
  },

  endGame: () => {
    const { stats, startTime, correctCharsTyped } = get();
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const wpm = calculateWPM(correctCharsTyped, elapsed);
    const score = calculateScore({
      survivalSeconds: elapsed,
      accuracy: stats.accuracy,
      wpm,
      wordsCompleted: stats.wordsCompleted,
    });

    set({
      gameState: 'game_over',
      stats: { ...stats, wpm, score, survivalSeconds: Math.round(elapsed) },
    });

    // Persist to localStorage for guest users
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('th_highscore') || '0');
      if (score > prev) {
        localStorage.setItem('th_highscore', String(score));
      }
    }
  },

  resetGame: () => {
    set({
      gameState: 'idle',
      currentWord: getNextWord(0),
      inputValue: '',
      playerDistance: INITIAL_DISTANCE,
      playerVelocity: 0,
      stats: initialStats(),
      startTime: null,
      totalCharsTyped: 0,
      correctCharsTyped: 0,
      isShaking: false,
      isGlowing: false,
      isComboActive: false,
    });
  },

  // -----------------------------------------------------------------------
  setInput: (value) => {
    const state = get();
    const { currentWord, inputValue: prevInput, gameState, playerDistance } = state;

    if (gameState !== 'playing') return;

    // Auto-advance: exact match → submit immediately without pressing Enter
    if (value === currentWord) {
      set({ inputValue: value });
      get().submitWord();
      return;
    }

    const addedChar = value.length > prevInput.length;
    const wrongChar = addedChar && !currentWord.startsWith(value);

    set({ inputValue: value });

    if (wrongChar) {
      const newDistance = Math.max(0, playerDistance - WRONG_CHAR_PENALTY);
      set({ isShaking: true, playerDistance: newDistance });
      setTimeout(() => set({ isShaking: false }), 350);
      if (newDistance <= GAME_OVER_DISTANCE) get().endGame();
    }
  },

  submitWord: () => {
    const {
      inputValue,
      currentWord,
      stats,
      startTime,
      totalCharsTyped,
      correctCharsTyped,
      playerDistance,
      playerVelocity,
    } = get();

    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const trimmed = inputValue.trim();
    const isCorrect = trimmed === currentWord;

    if (isCorrect) {
      const newCombo = stats.combo + 1;
      const newWordsCompleted = stats.wordsCompleted + 1;
      const newCorrectChars = correctCharsTyped + currentWord.length;
      const newTotalChars = Math.max(totalCharsTyped, newCorrectChars);
      const accuracy = calculateAccuracy(newCorrectChars, newTotalChars);
      const wpm = calculateWPM(newCorrectChars, Math.max(elapsed, 0.1));

      const pushForce = getWordPushForce(currentWord.length, newCombo);
      const distBoost = getWordDistanceBoost(currentWord);
      const newVelocity = playerVelocity + pushForce;
      const newDistance = Math.min(playerDistance + distBoost, 100);

      const difficulty = getDifficulty(elapsed);
      const nextWord = getNextWord(difficulty);

      const score = calculateScore({
        survivalSeconds: elapsed,
        accuracy,
        wpm,
        wordsCompleted: newWordsCompleted,
      });

      set({
        currentWord: nextWord,
        inputValue: '',
        correctCharsTyped: newCorrectChars,
        totalCharsTyped: newTotalChars,
        playerVelocity: newVelocity,
        playerDistance: newDistance,
        isGlowing: true,
        isComboActive: newCombo >= 3,
        stats: {
          ...stats,
          combo: newCombo,
          bestCombo: Math.max(stats.bestCombo, newCombo),
          wordsCompleted: newWordsCompleted,
          accuracy,
          wpm,
          score,
        },
      });

      setTimeout(() => set({ isGlowing: false }), 600);
    } else {
      // Wrong word submission — lose distance + accuracy penalty
      const newErrors = stats.errorCount + 1;
      const newTotal = totalCharsTyped + Math.max(trimmed.length, 1);
      const accuracy = calculateAccuracy(correctCharsTyped, newTotal);
      const newDistance = Math.max(0, playerDistance - WRONG_WORD_PENALTY);

      set({
        inputValue: '',
        isShaking: true,
        totalCharsTyped: newTotal,
        playerDistance: newDistance,
        stats: {
          ...stats,
          combo: 0,
          errorCount: newErrors,
          accuracy,
        },
        isComboActive: false,
      });

      setTimeout(() => set({ isShaking: false }), 400);
      if (newDistance <= GAME_OVER_DISTANCE) get().endGame();
    }
  },

  // -----------------------------------------------------------------------
  // Called every animation frame with delta time in seconds
  tickPhysics: (delta: number) => {
    const { playerDistance, playerVelocity, stats, startTime, gameState } = get();

    if (gameState !== 'playing') return;

    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;

    const pull = getBlackHolePull({
      elapsedSeconds: elapsed,
      accuracy: stats.accuracy,
      combo: stats.combo,
    });

    // Velocity decay: 0.96 keeps forward momentum after correct words longer
    const drag = 0.96;
    const newVelocity = (playerVelocity - pull * delta) * drag;

    const newDistance = playerDistance + newVelocity * delta;

    if (newDistance <= GAME_OVER_DISTANCE) {
      get().endGame();
      return;
    }

    const survivalSeconds = Math.floor(elapsed);
    const correctChars = get().correctCharsTyped;
    const wpm = calculateWPM(correctChars, Math.max(elapsed, 0.1));
    const score = calculateScore({
      survivalSeconds,
      accuracy: stats.accuracy,
      wpm,
      wordsCompleted: stats.wordsCompleted,
    });

    set({
      playerDistance: Math.min(newDistance, 100),
      playerVelocity: newVelocity,
      stats: { ...stats, survivalSeconds, wpm, score },
    });
  },

  setShaking: (v) => {
    set({ isShaking: v });
    if (v) setTimeout(() => set({ isShaking: false }), 400);
  },

  setGlowing: (v) => set({ isGlowing: v }),
}));
