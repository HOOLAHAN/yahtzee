import { DieFace, ScoreEntry } from "./types";
import { calculateScore, calculateChance, calculateFullHouse, isStraight } from "./scoreCalculator";
import { startNewRound } from "./gameControl";

export const rollDie = (): DieFace => {
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
  setScoreHistory: React.Dispatch<React.SetStateAction<ScoreEntry[]>>,
  scoreHistory: ScoreEntry[],
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
      setScoreHistory([...scoreHistory, { dice: newDice, scoreType: 'Placeholder', total: newCurrentScore }]);
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

export const toggleHoldDie = (index: number, heldDice: Set<number>, setHeldDice: React.Dispatch<React.SetStateAction<Set<number>>>) => {
  const newHeldDice = new Set(heldDice);
  if (newHeldDice.has(index)) {
    newHeldDice.delete(index);
  } else {
    newHeldDice.add(index);
  }
  setHeldDice(newHeldDice);
};
