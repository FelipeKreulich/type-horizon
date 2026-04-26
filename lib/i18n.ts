export type Language = 'en' | 'pt';

export const i18n = {
  en: {
    // Landing
    tagline: 'Typing Survival',
    description:
      'A black hole is pulling you in. Type fast to escape. Every word buys you distance.',
    yourBest: 'Your best',
    playNow: 'Play Now',
    hint1: 'Type the word — advances automatically on match',
    hint2: 'Longer words = more distance boost',
    hint3: 'Build combos to reduce pull',
    hint4: 'Errors pull you toward the void',
    // HUD
    score: 'Score',
    distance: 'Distance',
    survived: 's survived',
    away: 'u away',
    wpm: 'WPM',
    acc: 'Acc',
    combo: 'COMBO',
    // Combo labels
    onFire: 'ON FIRE',
    legendary: 'LEGENDARY',
    godlike: 'GODLIKE',
    // Game over
    consumed: 'Consumed',
    consumedSub: 'The black hole got you.',
    scoreLabel: 'Score',
    survivedLabel: 'Survived',
    wpmLabel: 'WPM',
    accuracyLabel: 'Accuracy',
    wordsLabel: 'Words',
    bestComboLabel: 'Best Combo',
    newHighScore: '★ New High Score! ★',
    tryAgain: 'Try Again',
    menu: 'Menu',
    localSave: 'High score saved locally.',
    best: 'Best',
    // Countdown
    go: 'GO!',
    // Input
    startTyping: 'start typing…',
  },
  pt: {
    // Landing
    tagline: 'Sobrevivência de Digitação',
    description:
      'Um buraco negro está te puxando. Digite rápido para escapar. Cada palavra compra distância.',
    yourBest: 'Seu melhor',
    playNow: 'Jogar Agora',
    hint1: 'Digite a palavra — avança automaticamente ao completar',
    hint2: 'Palavras longas = mais impulso de distância',
    hint3: 'Combos reduzem a força de atração',
    hint4: 'Erros te puxam para o vazio',
    // HUD
    score: 'Pontos',
    distance: 'Distância',
    survived: 's sobrevivido',
    away: 'u de dist.',
    wpm: 'PPM',
    acc: 'Prec',
    combo: 'COMBO',
    // Combo labels
    onFire: 'EM CHAMAS',
    legendary: 'LENDÁRIO',
    godlike: 'DIVINO',
    // Game over
    consumed: 'Consumido',
    consumedSub: 'O buraco negro te capturou.',
    scoreLabel: 'Pontos',
    survivedLabel: 'Sobreviveu',
    wpmLabel: 'PPM',
    accuracyLabel: 'Precisão',
    wordsLabel: 'Palavras',
    bestComboLabel: 'Melhor Combo',
    newHighScore: '★ Novo Recorde! ★',
    tryAgain: 'Tentar Novamente',
    menu: 'Menu',
    localSave: 'Recorde salvo localmente.',
    best: 'Melhor',
    // Countdown
    go: 'VAI!',
    // Input
    startTyping: 'comece a digitar…',
  },
} as const;

export type Translations = (typeof i18n)['en'];
