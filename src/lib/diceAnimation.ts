export type DiceAnimation = 'tumble' | 'shake' | 'bounce' | 'bounceSpin' | 'spinWiggle' | 'quick';

export const diceAnimationDuration: Record<DiceAnimation, number> = {
  tumble: 860,
  shake: 650,
  bounce: 920,
  bounceSpin: 1000,
  spinWiggle: 700,
  quick: 420,
};

export const diceAnimations: Array<{ value: DiceAnimation; label: string; description: string }> = [
  { value: 'tumble', label: 'Tumble', description: 'A full 3D throw and landing' },
  { value: 'shake', label: 'Shake', description: 'Fast hand-shaken movement' },
  { value: 'bounce', label: 'Bounce', description: 'A playful spring and settle' },
  { value: 'bounceSpin', label: 'Bouncing Spin', description: 'Bounces while spinning through the air' },
  { value: 'spinWiggle', label: 'Classic', description: 'The original spin and wiggle' },
  { value: 'quick', label: 'Quick', description: 'A short, subtle flip' },
];
