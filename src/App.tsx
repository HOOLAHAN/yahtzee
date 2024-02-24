// App.tsx

import React, { useState } from 'react';
import './tailwind.css';
import Navbar from './components/Navbar';
import ScoreCard from './components/ScoreCard';
import ScoreFlash from './components/ScoreFlash';
import GameControlButtons from './components/GameControlButtons';
import ScoreDisplay from './components/ScoreDisplay';
import CategoryButtons from './components/CategoryButtons';
import DiceControl from './components/DiceControl';
import ScoresSection from './components/ScoresSection';
import { calculateCurrentCategoryScore, calculateMaximumScore } from './functions/scoreCalculator';
import { rollDice, toggleHoldDie } from './functions/diceLogic';
import { resetGame, startNewRound } from './functions/gameControl';
import { ScoreEntry } from './functions/types';
import { printDocument, getDieSize } from './functions/utils';
import { useWindowSize } from './hooks/useWindowSize';

interface AppProps {
  initialDice?: number[];
}

const App: React.FC<AppProps> = ({ initialDice = [1, 1, 1, 1, 1] }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [usedCategories, setUsedCategories] = useState(new Set<string>());
  const [shouldShake, setShouldShake] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashCategory, setFlashCategory] = useState('');
  
  const windowSize = useWindowSize();
  const dieSize = getDieSize(windowSize);
  
  React.useEffect(() => {
    if (scoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [scoreHistory]);

  const handleStartNewRound = () => {
    startNewRound(
      setDice, 
      setRollsLeft, 
      setHeldDice, 
      setCurrentScore, 
      setHasRolled, 
      setTotalScore, 
      initialDice, 
      totalScore, 
      currentScore
    );
  };
  
  return (
    <div className="App">
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
        <DiceControl
          dice={dice}
          heldDice={heldDice}
          toggleHoldDie={(index: number) => toggleHoldDie(index, heldDice, setHeldDice)}
          rollsLeft={rollsLeft}
          hasRolled={hasRolled}
          shouldShake={shouldShake}
          dieSize={dieSize}
          usedCategoriesSize={usedCategories.size}
          onRollDice={() => {
            if (rollsLeft > 0) {
              setShouldShake(true);
              setTimeout(() => {
                setShouldShake(false);
                rollDice(
                  rollsLeft,
                  dice,
                  heldDice,
                  setHasRolled,
                  setDice,
                  setRollsLeft,
                  setCurrentScore,
                );
              }, 800);
            }
          }}
        />
        <ScoreDisplay
          currentScore={calculateMaximumScore(dice, hasRolled, usedCategories)}
          totalScore={totalScore}
        />
        { hasRolled && <h2 className="text-2xl mb-2">Lock In Score:</h2> }
        <CategoryButtons
          dice={dice}
          hasRolled={hasRolled}
          usedCategories={usedCategories}
          setUsedCategories={setUsedCategories}
          setTotalScore={setTotalScore}
          totalScore={totalScore}
          setScoreHistory={setScoreHistory}
          scoreHistory={scoreHistory}
          startNewRound={handleStartNewRound}
          setCurrentScore={setCurrentScore}
          setHasRolled={setHasRolled}
          setDice={setDice}
          setRollsLeft={setRollsLeft}
          setHeldDice={setHeldDice}
          initialDice={initialDice}
          currentScore={currentScore}
          calculateScoreFunction={calculateCurrentCategoryScore}
          setFlashCategory={setFlashCategory}
          setShowFlash={setShowFlash}
        />
        <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
        <h2 className="text-2xl mb-2">Scores</h2>
        <ScoresSection dice={dice} hasRolled={hasRolled} />
        { showScoreCard && <h2 className="text-2xl mb-2">Score Card:</h2> }
        <div className="flex space-x-2">
        { showScoreCard && <ScoreCard scoreHistory={scoreHistory} totalScore={totalScore}/> }
        </div>
        { scoreHistory.length > 0 &&
        <GameControlButtons
        onResetGame={() => resetGame(setDice, setRollsLeft, setHeldDice, setCurrentScore, setScoreHistory, setHasRolled, setTotalScore, initialDice, setUsedCategories)}
        onPrintDocument={printDocument}
        isMobile={windowSize < 640}
      />
        }
      </div>
    </div>
  );
};

export default App;