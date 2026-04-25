import { z } from 'zod';

// Validates a score submission (for when auth + leaderboard are added)
export const ScoreSchema = z.object({
  score: z.number().int().nonnegative().max(9_999_999),
  wpm: z.number().int().nonnegative().max(300),
  accuracy: z.number().min(0).max(100),
  survivalSeconds: z.number().nonnegative(),
  wordsCompleted: z.number().int().nonnegative(),
  bestCombo: z.number().int().nonnegative(),
});

export type Score = z.infer<typeof ScoreSchema>;

// Validates localStorage highscore value
export const LocalHighscoreSchema = z.number().int().nonnegative().catch(0);
