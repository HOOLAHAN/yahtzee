// Assuming the corrected import paths and function signature
import { rollDice } from './diceLogic'; // Make sure this path is correct

export const handleRollDice = (
  rollsLeft: number,
  dice: number[],
  heldDice: Set<number>,
  setShouldShake: React.Dispatch<React.SetStateAction<boolean>>,
  setHasRolled: React.Dispatch<React.SetStateAction<boolean>>, // Updated to include setHasRolled
  setDice: React.Dispatch<React.SetStateAction<number[]>>,
  setRollsLeft: React.Dispatch<React.SetStateAction<number>>,
  setCurrentScore: React.Dispatch<React.SetStateAction<number>>
) => {
  if (rollsLeft > 0) {
    setShouldShake(true);
    setTimeout(() => {
      setShouldShake(false);
      rollDice(rollsLeft, dice, heldDice, setHasRolled, setDice, setRollsLeft, setCurrentScore);
    }, 800);
  }
};
