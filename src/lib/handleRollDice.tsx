// Assuming the corrected import paths and function signature
import { rollDice } from './diceLogic'; // Make sure this path is correct
import { DiceAnimation, diceAnimationDuration } from './diceAnimation';

export const handleRollDice = (
  rollsLeft: number,
  dice: number[],
  heldDice: Set<number>,
  setShouldShake: React.Dispatch<React.SetStateAction<boolean>>,
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, // Updated to include setHasRolled
  setDice: React.Dispatch<React.SetStateAction<number[]>>,
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>,
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>,
  rollValues?: number[],
  animation: DiceAnimation = 'tumble',
) => {
  if (rollsLeft > 0) {
    const duration = diceAnimationDuration[animation];
    setShouldShake(true);
    setTimeout(() => {
      rollDice(rollsLeft, dice, heldDice, setHasRolled, setDice, setRollsLeft, setCurrentScore, rollValues);
    }, Math.max(120, duration - 150));
    setTimeout(() => setShouldShake(false), duration);
  }
};
