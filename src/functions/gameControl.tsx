import { ScoreEntry } from "./types";

export const canLockInScore = (
  category: string,
  hasRolled: boolean,
  usedCategories: Set<string>,
) => {
  if (!hasRolled) return false;

  if (usedCategories.has(category)) {
    return false;
  }

  return true;
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
  calculateScoreFunction: Function,
  isTwoPlayer: boolean,
  currentPlayer: number,
  player1TotalScore: number,
  player2TotalScore: number,
  setPlayer1TotalScore: Function,
  setPlayer2TotalScore: Function
) => {
  // Check if the category has already been used
  if (usedCategories.has(category)) return;

  // Calculate the score using the passed-in calculateScoreFunction
  const newScore = calculateScoreFunction(category, dice);

  // Validate if the calculated score makes it eligible to lock in
  let shouldLockIn = true;

  if (!shouldLockIn) return;

  // Update the set of used categories
  const newUsedCategories = new Set(usedCategories);
  newUsedCategories.add(category);
  setUsedCategories(newUsedCategories);

  // Update the total score
  const newTotalScore = totalScore + newScore;
  setTotalScore(newTotalScore);

  // Update the score history
  setScoreHistory([
    ...scoreHistory,
    {
      dice: [...dice],
      category,
      roundScore: newScore,
    },
  ]);

  // Update player-specific scores if in two-player mode
  if (isTwoPlayer) {
    if (currentPlayer === 1) {
      setPlayer1TotalScore(newTotalScore);
    } else {
      setPlayer2TotalScore(newTotalScore);
    }
  }

  // Start a new round
  startNewRound(
    setDice,
    setRollsLeft,
    setHeldDice,
    setCurrentScore,
    setHasRolled,
    setTotalScore,
    initialDice,
    newTotalScore,
    currentScore
  );
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
  setPlayer1TotalScore?: React.Dispatch<React.SetStateAction<number>>,
  setPlayer2TotalScore?: React.Dispatch<React.SetStateAction<number>>,
  isTwoPlayer?: boolean
) => {
  setDice(initialDice);
  setRollsLeft(3);
  setHeldDice(new Set());
  setCurrentScore(0);
  setScoreHistory([]);
  setHasRolled(false);
  setTotalScore(0);
  setUsedCategories(new Set<string>());

  // Reset player-specific scores if in two-player mode
  if (isTwoPlayer) {
    setPlayer1TotalScore?.(0);
    setPlayer2TotalScore?.(0);
  }
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
};
