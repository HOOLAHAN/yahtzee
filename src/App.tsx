import React, { useState } from 'react';
import './tailwind.output.css';
import Navbar from './components/Navbar'; 

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  isHeld: boolean;
}

const Die: React.FC<DieProps> = ({ value, canHold, onToggleHold, isHeld }) => {
  const baseStyle = 'transition-colors duration-300 ease-in-out text-2xl p-4 rounded-full flex items-center justify-center h-16 w-16';
  const heldStyle = 'bg-green-500 text-white shadow-lg';
  const notHeldStyle = 'bg-white text-black shadow hover:bg-gray-100';

  return (
    <div 
      className={`${baseStyle} ${isHeld ? heldStyle : notHeldStyle} ${canHold ? 'cursor-pointer' : ''}`}
      onClick={canHold ? onToggleHold : undefined}
      role="button"
      aria-label={`${value}`}
    >
      {value}
    </div>
  );
};

interface AppProps {
  initialDice?: number[];
}

type DieFace = 1 | 2 | 3 | 4 | 5 | 6;

const rollDie = (): DieFace => {
  return (Math.floor(Math.random() * 6) + 1) as DieFace;
};

const App: React.FC<AppProps> = ({ initialDice = [1, 1, 1, 1, 1] }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);

  const rollDice = () => {
    if (rollsLeft > 0) {
      setHasRolled(true);
      const newDice = dice.map((d, i) => (heldDice.has(i) ? d : rollDie()));
      setDice(newDice);
      const newRollsLeft = rollsLeft - 1;
      setRollsLeft(newRollsLeft);
      
      // Update current score here
      const newCurrentScore = calculateScore('ThreeOfAKind') + calculateScore('FourOfAKind') + calculateFullHouse()
      + (isStraight(dice, 4) ? 30 : 0)  // Small Straight: 30 points
      + (isStraight(dice, 5) ? 40 : 0)  // Large Straight: 40 points
      + (calculateScore('Yahtzee') ? 50 : 0)  // Yahtzee: 50 points
      + calculateChance();  // Chance: Sum of all dice
      setCurrentScore(newCurrentScore);
      
      // If no more rolls are left, consider the round to be over and update score history.
      if (newRollsLeft === 0) {
        setScoreHistory([...scoreHistory, newCurrentScore]);
      }
    }
  };
  

  const toggleHoldDie = (index: number) => {
    const newHeldDice = new Set(heldDice);
    if (newHeldDice.has(index)) {
      newHeldDice.delete(index);
    } else {
      newHeldDice.add(index);
    }
    setHeldDice(newHeldDice);
  };


  const calculateScore = (type: 'ThreeOfAKind' | 'FourOfAKind' | 'Yahtzee') => {
    const counts: { [key: number]: number } = {};
    for (const die of dice) {
      counts[die] = (counts[die] || 0) + 1;
    }
    for (const count of Object.values(counts)) {
      if (type === 'ThreeOfAKind' && count >= 3) {
        return dice.reduce((acc, curr) => acc + curr, 0);
      }
      if (type === 'FourOfAKind' && count >= 4) {
        return dice.reduce((acc, curr) => acc + curr, 0);
      }
    }
    if (type === 'Yahtzee') {
      for (const count of Object.values(counts)) {
        if (count === 5) {
          return 50; // Yahtzee score
        }
      }
    }
    return 0;
  };

  const calculateFullHouse = () => {
    const counts: { [key: number]: number } = {};
    
    // Count the occurrences of each die
    for (const die of dice) {
      counts[die] = (counts[die] || 0) + 1;
    }
    
    // Find dice that appear exactly 2 and 3 times
    let hasTwoOfAKind = false;
    let hasThreeOfAKind = false;
    for (const count of Object.values(counts)) {
      if (count === 2) {
        hasTwoOfAKind = true;
      }
      if (count === 3) {
        hasThreeOfAKind = true;
      }
    }
    
    // If we have both, it's a Full House, and the score is the sum of all dice
    if (hasTwoOfAKind && hasThreeOfAKind) {
      return dice.reduce((acc, curr) => acc + curr, 0);
    }
    
    return 0;
  };

  const isStraight = (dice: number[], minLength: number) => {
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

  const calculateChance = () => {
    return dice.reduce((acc, curr) => acc + curr, 0);
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
    <div className="App bg-gray-200 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
    <h1 className="text-4xl md:text-5xl font-semibold mb-4">Yahtzee!</h1>
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <button className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2" onClick={rollDice} disabled={rollsLeft <= 0}>
        Roll Dice (Rolls left: {rollsLeft})
      </button>
      <button className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-green-600 text-white rounded hover:bg-green-700 focus:ring focus:ring-green-200 mb-2" onClick={startNewRound}>
        Start New Round
      </button>
      <button className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2" onClick={resetGame}>
        Reset Game
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
      <div className="mb-1">Three of a Kind: {calculateScore('ThreeOfAKind')}</div>
      <div className="mb-1">Four of a Kind: {calculateScore('FourOfAKind')}</div>
      <div className="mb-1">Full House: {calculateFullHouse()}</div>
      <div className="mb-1">Small Straight: {isStraight(dice, 4) ? 30 : 0}</div>
      <div className="mb-1">Large Straight: {isStraight(dice, 5) ? 40 : 0}</div>
      <div className="mb-1">Yahtzee: {calculateScore('Yahtzee')}</div>
      <div className="mb-1">Chance: {calculateChance()}</div>
      </div>
    </div>
  );
};

export default App;
