// scoreCalculator.tsx

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
  
  if (type === 'Yahtzee') {
    return Object.values(counts).includes(5) ? 50 : 0;
  }
  
  const minCount = (type === 'ThreeOfAKind') ? 3 : 4;
  for (const count of Object.values(counts)) {
    if (count >= minCount) {
      return dice.reduce((acc, curr) => acc + curr, 0); // Sum of all dice
    }
  }
  
  return 0;
};


export const calculateSumOfDice = (dice: number[], targetNumber: number): number => {
  return dice.filter(d => d === targetNumber).reduce((acc, curr) => acc + curr, 0);
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

// Calculate the sum of dice for number categories.
export const calculateNumberScore = (category: string, dice: number[]): number => {
  const number = parseInt(category);
  return dice.reduce((acc, die) => acc + (die === number ? die : 0), 0);
};
