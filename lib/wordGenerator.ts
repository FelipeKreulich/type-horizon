// Word pools grouped by length — longer words give more escape distance
const SHORT_WORDS = [
  'run',
  'fly',
  'go',
  'win',
  'hit',
  'aim',
  'cut',
  'get',
  'set',
  'use',
  'act',
  'add',
  'ask',
  'bit',
  'box',
  'buy',
  'can',
  'cap',
  'car',
  'cat',
  'cup',
  'day',
  'dig',
  'dot',
  'dry',
  'eat',
  'end',
  'eye',
  'far',
  'fix',
  'fog',
  'fun',
  'gas',
  'hat',
  'hot',
  'ice',
  'ink',
  'jar',
  'jet',
  'job',
  'key',
  'kid',
  'lab',
  'law',
  'let',
  'lid',
  'lip',
  'log',
  'low',
  'map',
];

const MEDIUM_WORDS = [
  'space',
  'orbit',
  'laser',
  'storm',
  'force',
  'speed',
  'power',
  'black',
  'pulse',
  'drift',
  'craft',
  'warp',
  'nova',
  'jump',
  'burst',
  'dodge',
  'quick',
  'sharp',
  'focus',
  'track',
  'light',
  'drive',
  'surge',
  'probe',
  'vapor',
  'flame',
  'guard',
  'phase',
  'pixel',
  'solid',
  'rapid',
  'sonic',
  'prime',
  'ultra',
  'delta',
  'alpha',
  'shift',
  'blaze',
  'shock',
  'sweep',
  'flare',
  'glide',
  'pivot',
  'clash',
  'swarm',
  'plunge',
  'eject',
  'relay',
];

const LONG_WORDS = [
  'velocity',
  'supernova',
  'gravity',
  'asteroid',
  'dimension',
  'traverse',
  'nebula',
  'hyperspace',
  'singularity',
  'trajectory',
  'ignition',
  'catalyst',
  'resonance',
  'frequency',
  'magnitude',
  'sequence',
  'proximity',
  'momentum',
  'isolation',
  'subsystem',
  'generator',
  'threshold',
  'protocol',
  'override',
  'satellite',
  'radiation',
  'fragment',
  'collapse',
  'propulsion',
  'quantum',
  'synthetic',
  'transmit',
  'terminal',
  'electron',
  'particle',
  'wormhole',
  'vortex',
  'antimatter',
  'interstellar',
  'acceleration',
  'decelerate',
];

// Pick word based on current difficulty level (0–1)
export function getNextWord(difficulty: number): string {
  const roll = Math.random();

  // As difficulty grows, more long/medium words appear
  const longThreshold = 0.1 + difficulty * 0.3; // 10%→40%
  const medThreshold = 0.4 + difficulty * 0.2; // 40%→60%

  let pool: string[];
  if (roll < longThreshold) {
    pool = LONG_WORDS;
  } else if (roll < medThreshold) {
    pool = MEDIUM_WORDS;
  } else {
    pool = SHORT_WORDS;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Distance reward scales with word length
export function getWordDistanceBoost(word: string): number {
  const len = word.length;
  if (len <= 3) return 1.0;
  if (len <= 5) return 1.5;
  if (len <= 7) return 2.2;
  return 3.5;
}
