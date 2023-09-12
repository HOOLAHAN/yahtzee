import React, { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import Die from './components/Die';
import { 
  // rollDie, 
  calculateChance, 
  isStraight, 
  calculateFullHouse, 
  calculateScore, 
  rollDice } from './functions/utils';

interface AppProps {
  initialDice?: number[];
}

const App: React.FC<AppProps> = ({ initialDice = [1, 1, 1, 1, 1] }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set<string>());

  const toggleHoldDie = (index: number) => {
    const newHeldDice = new Set(heldDice);
    if (newHeldDice.has(index)) {
      newHeldDice.delete(index);
    } else {
      newHeldDice.add(index);
    }
    setHeldDice(newHeldDice);
  };

  const canLockInScore = (category: string) => {
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
  

  const lockInScore = (category: string) => {
    if (usedCategories.has(category)) return;
  
    let shouldLockIn = false;
    let newScore = 0;  // A variable to hold the score of the locked-in category
  
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
        shouldLockIn = newScore === 25;
        break;
      default:
        break;
    }
  
    if (!shouldLockIn) return;
  
    const newUsedCategories = new Set(usedCategories);
    newUsedCategories.add(category);
    setUsedCategories(newUsedCategories);
  
    // Update total score and score history
    setTotalScore(totalScore + newScore);
    setScoreHistory([...scoreHistory, newScore]);
    startNewRound();
  };
  
  // Function to reset the game
  const resetGame = () => {
    setDice(initialDice);
    setRollsLeft(3);
    setHeldDice(new Set());
    setCurrentScore(0);
    setScoreHistory([]);
    setHasRolled(false);
    setTotalScore(0);
  };

  const startNewRound = () => {
    // Reset state for the new round
    setDice(initialDice);
    setRollsLeft(3);
    setHeldDice(new Set());
    setCurrentScore(0);
    setHasRolled(false);
    // Add the score from the last round to the total score
    setTotalScore(totalScore + currentScore);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="flex space-x-2">
          <button onClick={() => rollDice(rollsLeft, dice, heldDice, hasRolled, setHasRolled, setDice, setRollsLeft, setCurrentScore, setScoreHistory, scoreHistory)} >
            Roll Dice (Rolls left: {rollsLeft})
          </button>
          <button className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-green-600 text-white rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2 mr-2" onClick={startNewRound}>
            Start New Round
          </button>
          <button className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2" onClick={resetGame}>
            Reset Game
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('ThreeOfAKind') ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2 mr-2`}
            onClick={() => lockInScore('ThreeOfAKind')}
            disabled={!canLockInScore('ThreeOfAKind')}
          >
            Lock in Three of a Kind
          </button>
          <button
            className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('FourOfAKind') ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2 mr-2`}
            onClick={() => lockInScore('FourOfAKind')}
            disabled={!canLockInScore('FourOfAKind')}
          >
            Lock in Four of a Kind
          </button>
          <button
            className={`transition duration-300 ease-in-out transform py-2 px-4 w-full md:w-auto ${canLockInScore('FullHouse') ? 'bg-green-600 text-white' : 'bg-gray-400 text-white cursor-not-allowed'} rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2`}
            onClick={() => lockInScore('FullHouse')}
            disabled={!canLockInScore('FullHouse')}
          >
            Lock in Full House
          </button>
        </div>
      <h2 className="text-2xl mb-2">Current Score: {currentScore}</h2>
      <h2 className="text-2xl mb-2">Total Score: {totalScore}</h2>
      <h2 className="text-2xl mb-2">Score History</h2>
      <ul className="list-decimal list-inside mb-6 text-blue-600">
        {scoreHistory.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-center space-x-4 space-y-4 mb-6">
        {dice.map((die, index) => (
          <Die
            key={index}
            value={die}
            canHold={rollsLeft > 0 && hasRolled}
            isHeld={heldDice.has(index)}
            onToggleHold={() => toggleHoldDie(index)}
          />
        ))}
      </div>
      <h2 className="text-2xl mb-2">Scores</h2>
      <div className="mb-1">Three of a Kind: {calculateScore('ThreeOfAKind', dice)}</div>
      <div className="mb-1">Four of a Kind: {calculateScore('FourOfAKind', dice)}</div>
      <div className="mb-1">Full House: {calculateFullHouse(dice)}</div>
      <div className="mb-1">Small Straight: {isStraight(dice, 4) ? 30 : 0}</div>
      <div className="mb-1">Large Straight: {isStraight(dice, 5) ? 40 : 0}</div>
      <div className="mb-1">Yahtzee: {calculateScore('Yahtzee', dice)}</div>
      <div className="mb-1">Chance: {calculateChance(dice)}</div>
     </div>
    </div>
  );
};

export default App;
