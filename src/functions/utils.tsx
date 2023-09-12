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
  setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>,
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>,
  setScoreHistory: React.Dispatch<React.SetStateAction<number[]>>,
  scoreHistory: number[],
  setTotalScore: React.Dispatch<React.SetStateAction<number>>,
  totalScore: number,
  currentScore: number
) => {
  if (rollsLeft > 0) {
    setHasRolled(true);
    const newDice = dice.map((d, i) => (heldDice.has(i) ? d : rollDie()));
    setDice(newDice);
    const newRollsLeft = rollsLeft - 1;
    setRollsLeft(newRollsLeft);

    const newCurrentScore = calculateScore('ThreeOfAKind', newDice) 
    + calculateScore('FourOfAKind', newDice) 
    + calculateFullHouse(newDice)
    + (isStraight(newDice, 4) ? 30 : 0)
    + (isStraight(newDice, 5) ? 40 : 0)
    + (calculateScore('Yahtzee', newDice) ? 50 : 0)
    + calculateChance(newDice);
    setCurrentScore(newCurrentScore);

    // If no more rolls are left, consider the round to be over.
    if (newRollsLeft === 0) {
      setScoreHistory([...scoreHistory, newCurrentScore]);
      startNewRound(
        setDice,
        setRollsLeft,
        setHeldDice,
        setCurrentScore,
        setHasRolled,
        setTotalScore,
        dice,  // or any initial dice state you'd like to start with
        totalScore,
        newCurrentScore
      );
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

    export const canLockInScore = (category: string, hasRolled: boolean, usedCategories: Set<string>, dice: number[]) => {
      if (!hasRolled) return false;
    
      if (usedCategories.has(category)) return false;
      
      switch (category) {
        case 'ThreeOfAKind':
          return calculateScore('ThreeOfAKind', dice) > 0;
        case 'FourOfAKind':
          return calculateScore('FourOfAKind', dice) > 0;
        case 'FullHouse':
          return calculateFullHouse(dice) > 0;
        default:
          return false;
      }
    };

    export const lockInScore = (
      category: string,
      usedCategories: Set<string>,
      setUsedCategories: Function,
      dice: number[],
      setTotalScore: Function,
      totalScore: number,
      setScoreHistory: Function,
      scoreHistory: number[],
      startNewRound: Function,
      setCurrentScore: Function,
      setHasRolled: Function,
      setDice: Function,
      setRollsLeft: Function,
      setHeldDice: Function,
      initialDice: number[],
      currentScore: number
    ) => {
      if (usedCategories.has(category)) return;
    
      let shouldLockIn = false;
      let newScore = 0;
    
      switch (category) {
        case 'ThreeOfAKind':
          newScore = calculateScore('ThreeOfAKind', dice);
          shouldLockIn = newScore > 0;
          break;
        case 'FourOfAKind':
          newScore = calculateScore('FourOfAKind', dice);
          shouldLockIn = newScore > 0;
          break;
        case 'FullHouse':
          newScore = calculateFullHouse(dice);
          shouldLockIn = newScore > 0;
          break;
        default:
          break;
      }
    
      if (!shouldLockIn) return;
    
      const newUsedCategories = new Set(usedCategories);
      newUsedCategories.add(category);
      setUsedCategories(newUsedCategories);
      setTotalScore(totalScore + newScore);
      setScoreHistory([...scoreHistory, newScore]);
      startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, setTotalScore, initialDice, totalScore, currentScore);
    };
    