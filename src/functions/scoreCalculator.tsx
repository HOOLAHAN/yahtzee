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

const categoryToNumber: { [key: string]: number } = {
  'Ones': 1,
  'Twos': 2,
  'Threes': 3,
  'Fours': 4,
  'Fives': 5,
  'Sixes': 6,
};

export const calculateNumberScore = (category: string, dice: number[]): number => {
  const number = categoryToNumber[category];
  if (number === undefined) return 0;
  return dice.reduce((acc, die) => acc + (die === number ? die : 0), 0);
};

// Unified function that delegates the scoring logic to specific functions based on category
export const calculateScoreFunction = (category: string, dice: number[]) => {
  switch (category) {
    case 'ThreeOfAKind':
    case 'FourOfAKind':
    case 'Yahtzee':
      return calculateScore(category, dice);
    case 'FullHouse':
      return calculateFullHouse(dice);
    case 'SmallStraight':
      return isStraight(dice, 4) ? 30 : 0;
    case 'LargeStraight':
      return isStraight(dice, 5) ? 40 : 0;
    case 'Chance':
      return calculateChance(dice);
    case 'Ones':
    case 'Twos':
    case 'Threes':
    case 'Fours':
    case 'Fives':
    case 'Sixes':
      return calculateNumberScore(category, dice);
    default:
      return 0;
  }
};

export const calculateCurrentCategoryScore = (category: string, dice: number[]) => {
  if (['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'].includes(category)) {
    return calculateNumberScore(category, dice);
  }
  if (['FullHouse'].includes(category)) {
    return calculateFullHouse(dice);
  }
  if (['SmallStraight'].includes(category)) {
    return isStraight(dice, 4) ? 30 : 0;
  }
  if (['LargeStraight'].includes(category)) {
    return isStraight(dice, 5) ? 40 : 0;
  }
  if (['Chance'].includes(category)) {
    return calculateChance(dice);
  }
  return calculateScore(category as "ThreeOfAKind" | "FourOfAKind" | "Yahtzee", dice);
};