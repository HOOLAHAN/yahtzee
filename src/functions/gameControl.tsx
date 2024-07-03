import { ScoreEntry, Category } from "./types";

export const canLockInScore = (
  category: Category,
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
  category: Category,
  usedCategories: Set<string>,
  setUsedCategories: React.Dispatch<React.SetStateAction<Set<string>>>,
  dice: number[],
  setTotalScore: React.Dispatch<React.SetStateAction<number>>,
  totalScore: number,
  setScoreHistory: React.Dispatch<React.SetStateAction<ScoreEntry[]>>,
  scoreHistory: ScoreEntry[],
  startNewRound: (setDice: React.Dispatch<React.SetStateAction<number[]>>, setRollsLeft: React.Dispatch<React.SetStateAction<number>>, setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>, setCurrentScore: React.Dispatch<React.SetStateAction<number>>, setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, initialDice: number[]) => void,
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>,
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>,
  setDice: React.Dispatch<React.SetStateAction<number[]>>,
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>,
  setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>,
  initialDice: number[],
  currentScore: number,
  calculateScoreFunction: (category: Category, dice: number[]) => number,
  isTwoPlayer: boolean,
  currentPlayer: number,
  player1TotalScore: number,
  player2TotalScore: number,
  setPlayer1TotalScore: React.Dispatch<React.SetStateAction<number>>,
  setPlayer2TotalScore: React.Dispatch<React.SetStateAction<number>>,
) => {
  // Check if the category has already been used
  if (usedCategories.has(category)) return;

  // Calculate the score using the passed-in calculateScoreFunction
  const newScore = calculateScoreFunction(category, dice);

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

  if (isTwoPlayer) {
    if (currentPlayer === 1) {
      setPlayer1TotalScore(newTotalScore);
    } else {
      setPlayer2TotalScore(newTotalScore);
    }
  }

  // Start a new round
  startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, initialDice);
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
  initialDice: number[]
  ) => {
    // Reset state for the new round
    setDice(initialDice);
    setRollsLeft(3);
    setHeldDice(new Set());
    setCurrentScore(0);
    setHasRolled(false);
  };
