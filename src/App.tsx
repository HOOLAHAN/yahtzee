import React, { useState } from 'react';
import './App.css';

interface DieProps {
  value: number;
  canHold: boolean;
  onToggleHold: () => void;
  hasRolled: boolean;
}

const Die: React.FC<DieProps> = ({ value, canHold, onToggleHold, hasRolled }) => {
  return (
    <span className="die">
      {value}
      {canHold && hasRolled && <input type="checkbox" onChange={onToggleHold} />}
    </span>
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
      const newCurrentScore = calculateScore('ThreeOfAKind') + calculateScore('FourOfAKind') + calculateFullHouse();
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


  const calculateScore = (type: 'ThreeOfAKind' | 'FourOfAKind') => {
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
      <h1>Yahtzee!</h1>
      <button onClick={rollDice} disabled={rollsLeft <= 0}>
      Roll Dice (Rolls left: {rollsLeft})
    </button>
    <button onClick={startNewRound}>
        Start New Round
      </button>
    <button onClick={resetGame}>
      Reset Game
    </button>
    <h2>Current Score: {currentScore}</h2>
    <h2>Total Score: {totalScore}</h2>
      <h2>Score History</h2>
      <ul>
        {scoreHistory.map((score, index) => (
          <li key={index}>{score}</li>
        ))}
      </ul>
      <div>
        {dice.map((die, index) => (
          <Die
            key={index}
            value={die}
            canHold={rollsLeft > 0}
            hasRolled={hasRolled} 
            onToggleHold={() => toggleHoldDie(index)}
          />
        ))}
      </div>
      <h2>Scores</h2>
      <div>
        Three of a Kind: {calculateScore('ThreeOfAKind')}
      </div>
      <div>
        Four of a Kind: {calculateScore('FourOfAKind')}
      </div>
      <div>
        Full House: {calculateFullHouse()}
      </div>
    </div>
  );
  
};

export default App;
