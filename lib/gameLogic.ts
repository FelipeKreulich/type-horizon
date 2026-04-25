// ---------------------------------------------------------------------------
// Core game logic: WPM, accuracy, scoring, difficulty
// ---------------------------------------------------------------------------

export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  // Standard: 1 word = 5 characters
  const words = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function calculateScore(params: {
  survivalSeconds: number;
  accuracy: number;
  wpm: number;
  wordsCompleted: number;
}): number {
  const { survivalSeconds, accuracy, wpm, wordsCompleted } = params;
  const timeBonus = survivalSeconds * 10;
  const accuracyMultiplier = accuracy / 100;
  const wpmBonus = wpm * 2;
  const wordBonus = wordsCompleted * 15;
  return Math.round((timeBonus + wpmBonus + wordBonus) * accuracyMultiplier);
}

// Difficulty scalar 0→1 over time (asymptotic, never fully reaches 1)
export function getDifficulty(elapsedSeconds: number): number {
  return 1 - Math.exp(-elapsedSeconds / 90);
}

// Black hole pull force at current moment
// Base pull + difficulty increase + accuracy penalty
export function getBlackHolePull(params: {
  elapsedSeconds: number;
  accuracy: number;
  combo: number;
}): number {
  const { elapsedSeconds, accuracy, combo } = params;
  const difficulty = getDifficulty(elapsedSeconds);

  // Base pull grows from 0.4 to 2.5 u/s²
  const basePull = 0.4 + difficulty * 2.1;

  // Accuracy: below 80% starts adding extra pull (up to +1.2)
  const accuracyPenalty = accuracy < 80 ? ((80 - accuracy) / 80) * 1.2 : 0;

  // Active combo reduces pull slightly (combo capped at 10)
  const comboRelief = Math.min(combo, 10) * 0.04;

  return Math.max(0.1, basePull + accuracyPenalty - comboRelief);
}

// Forward push reward on correct word
export function getWordPushForce(wordLength: number, combo: number): number {
  const base = 2 + wordLength * 0.4;
  const comboMultiplier = 1 + Math.min(combo, 15) * 0.08;
  return base * comboMultiplier;
}
