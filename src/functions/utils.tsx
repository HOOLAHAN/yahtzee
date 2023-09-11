// utils.tsx

type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

export const rollDie = (): DieFace => {
  return (Math.floor(Math.random() * 6) + 1) as DieFace;
};


export const calculateChance = (dice: number[]): number => {
  return dice.reduce((acc: number, curr: number) => acc + curr, 0);
};

export const isStraight = (dice: number[], minLength: number) => {
  const uniqueSortedDice = Array.from(new Set(dice)).sort();
  let consecutiveCount = 1;
  
  for (let i = 1; i < uniqueSortedDice.length; i++) {
    if (uniqueSortedDice[i] - uniqueSortedDice[i - 1] === 1) {
      consecutiveCount++;
      if (consecutiveCount >= minLength) {
        return true;
      }
    } else {
      consecutiveCount = 1;
    }
  }
  
  return false;
};

export const calculateFullHouse = (dice: number[]) => {
  const counts: { [key: number]: number } = {};
  for (const die of dice) {
    counts[die] = (counts[die] || 0) + 1;
  }
  let hasTwoOfAKind = false;
  let hasThreeOfAKind = false;
  for (const count of Object.values(counts)) {
    if (count === 2) hasTwoOfAKind = true;
    if (count === 3) hasThreeOfAKind = true;
  }
  return hasTwoOfAKind && hasThreeOfAKind ? 25 : 0;
};

export const calculateScore = (type: 'ThreeOfAKind' | 'FourOfAKind' | 'Yahtzee', dice: number[]) => {
  const counts: { [key: number]: number } = {};
  for (const die of dice) {
    counts[die] = (counts[die] || 0) + 1;
  }
  let sum = 0;
  for (const [die, count] of Object.entries(counts)) {
    if (type === 'ThreeOfAKind' && count >= 3) {
      sum += parseInt(die) * 3;
    }
    if (type === 'FourOfAKind' && count >= 4) {
      sum += parseInt(die) * 4;
    }
  }
  if (type === 'Yahtzee') {
    for (const count of Object.values(counts)) {
      if (count === 5) {
        return 50; // Yahtzee score
      }
    }
  }
  return sum;
};