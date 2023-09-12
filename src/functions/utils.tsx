// utils.tsx

type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

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

const rollDie = (): DieFace => {
  return (Math.floor(Math.random() * 6) + 1) as DieFace;
};

export const rollDice = (
  rollsLeft: number,
  dice: number[],
  heldDice: Set<number>,
  hasRolled: boolean,
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>,
  setDice: React.Dispatch<React.SetStateAction<number[]>>,
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>,
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>,
  setScoreHistory: React.Dispatch<React.SetStateAction<number[]>>,
  scoreHistory: number[]
) => {
  if (rollsLeft > 0) {
    setHasRolled(true);
    const newDice = dice.map((d, i) => (heldDice.has(i) ? d : rollDie()));
    setDice(newDice);
    const newRollsLeft = rollsLeft - 1;
    setRollsLeft(newRollsLeft);
    
    if (hasRolled) {
      const newCurrentScore = calculateScore('ThreeOfAKind', newDice) 
      + calculateScore('FourOfAKind', newDice) 
      + calculateFullHouse(newDice)
      + (isStraight(newDice, 4) ? 30 : 0)  // Small Straight: 30 points
      + (isStraight(newDice, 5) ? 40 : 0)  // Large Straight: 40 points
      + (calculateScore('Yahtzee', newDice) ? 50 : 0)  // Yahtzee: 50 points
      + calculateChance(newDice);  // Chance: Sum of all dice
      setCurrentScore(newCurrentScore);
      
      // If no more rolls are left, consider the round to be over and update score history.
      if (newRollsLeft === 0) {
        setScoreHistory([...scoreHistory, newCurrentScore]);
      }
    }
  }
};

  export const resetGame = (
    setDice: React.Dispatch<React.SetStateAction<number[]>>, 
    setRollsLeft: React.Dispatch<React.SetStateAction<number>>, 
    setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>, 
    setCurrentScore: React.Dispatch<React.SetStateAction<number>>, 
    setScoreHistory: React.Dispatch<React.SetStateAction<number[]>>, 
    setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, 
    setTotalScore: React.Dispatch<React.SetStateAction<number>>, 
    initialDice: number[]
    ) => {
    setDice(initialDice);
    setRollsLeft(3);
    setHeldDice(new Set());
    setCurrentScore(0);
    setScoreHistory([]);
    setHasRolled(false);
    setTotalScore(0);
  };
  

  export const startNewRound = (
    setDice: React.Dispatch<React.SetStateAction<number[]>>, 
    setRollsLeft: React.Dispatch<React.SetStateAction<number>>, 
    setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>, 
    setCurrentScore: React.Dispatch<React.SetStateAction<number>>, 
    setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, 
    setTotalScore: React.Dispatch<React.SetStateAction<number>>, 
    initialDice: number[], 
    totalScore: number, 
    currentScore: number
    ) => {
      // Reset state for the new round
      setDice(initialDice);
      setRollsLeft(3);
      setHeldDice(new Set());
      setCurrentScore(0);
      setHasRolled(false);
      // Add the score from the last round to the total score
      setTotalScore(totalScore + currentScore);
    };

    export const toggleHoldDie = (index: number, heldDice: Set<number>, setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>) => {
      const newHeldDice = new Set(heldDice);
      if (newHeldDice.has(index)) {
        newHeldDice.delete(index);
      } else {
        newHeldDice.add(index);
      }
      setHeldDice(newHeldDice);
    };