import { calculateScore, calculateFullHouse, isStraight, calculateChance } from "./scoreCalculator";
import { ScoreEntry } from "./types";

export const canLockInScore = (
  category: string, 
  hasRolled: boolean, 
  usedCategories: Set<string>, 
  dice: number[]
) => {
  if (!hasRolled) return false;

  if (usedCategories.has(category)) {
    return false;
  }

  let newScore = 0;
  let shouldLockIn = false;
  
  switch (category) {
    case 'ThreeOfAKind':
      return calculateScore('ThreeOfAKind', dice) > 0;
    case 'FourOfAKind':
      return calculateScore('FourOfAKind', dice) > 0;
    case 'FullHouse':
      return calculateFullHouse(dice) > 0;
    case 'SmallStraight':
      return isStraight(dice, 4);
    case 'LargeStraight':
      return isStraight(dice, 5);
    case 'Yahtzee':
      newScore = calculateScore('Yahtzee', dice);
      shouldLockIn = newScore > 0;
      break;
    case 'Chance':
      newScore = calculateChance(dice);
      shouldLockIn = true; // You can always take a Chance score.
      break;
    case 'Ones':
    case 'Twos':
    case 'Threes':
    case 'Fours':
    case 'Fives':
    case 'Sixes':
      const numValue = parseInt(category.charAt(0)); // Extract the number value from the string.
      newScore = dice.reduce((acc, curr) => curr === numValue ? acc + curr : acc, 0);
      return newScore > 0;
    default:
      return false;
  }
  return shouldLockIn;
};    

export const lockInScore = (
  category: string,
  usedCategories: Set<string>,
  setUsedCategories: Function,
  dice: number[],
  setTotalScore: Function,
  totalScore: number,
  setScoreHistory: Function,
  scoreHistory: ScoreEntry[],
  startNewRound: Function,
  setCurrentScore: Function,
  setHasRolled: Function,
  setDice: Function,
  setRollsLeft: Function,
  setHeldDice: Function,
  initialDice: number[],
  currentScore: number,
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
    case 'SmallStraight':
      newScore = isStraight(dice, 4) ? 30 : 0;
      shouldLockIn = newScore > 0;
      break;
    case 'LargeStraight':
      newScore = isStraight(dice, 5) ? 40 : 0;
      shouldLockIn = newScore > 0;
      break;
    case 'Yahtzee':
      newScore = calculateScore('Yahtzee', dice);
      shouldLockIn = newScore > 0;
      break;
    case 'Chance':
      newScore = calculateChance(dice);
      shouldLockIn = true; // You can always take a Chance score.
      break;
    case 'Ones':
    case 'Twos':
    case 'Threes':
    case 'Fours':
    case 'Fives':
    case 'Sixes':
      const numValue = parseInt(category);
      newScore = dice.reduce((acc, curr) => curr === numValue ? acc + curr : acc, 0);
      shouldLockIn = newScore > 0;
      break;
    default:
      break;
  }

  if (!shouldLockIn) return;

  const newUsedCategories = new Set(usedCategories);
  newUsedCategories.add(category);
  // setUsedCategories(newUsedCategories);
  setUsedCategories(new Set(usedCategories).add(category));
  setTotalScore(totalScore + newScore);
  setScoreHistory([
    ...scoreHistory,
    {
      dice: [...dice],
      scoreType: category,
      total: totalScore + newScore,
    },
  ]);
  startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, setTotalScore, initialDice, totalScore, currentScore);
};

export const resetGame = (
  setDice: React.Dispatch<React.SetStateAction<number[]>>, 
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>, 
  setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>, 
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>, 
  setScoreHistory: React.Dispatch<React.SetStateAction<ScoreEntry[]>>,
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, 
  setTotalScore: React.Dispatch<React.SetStateAction<number>>, 
  initialDice: number[],
  setUsedCategories: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
  setDice(initialDice);
  setRollsLeft(3);
  setHeldDice(new Set());
  setCurrentScore(0);
  setScoreHistory([]);
  setHasRolled(false);
  setTotalScore(0);
  setUsedCategories(new Set<string>());
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

