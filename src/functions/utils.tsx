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