// Game.tsx
import { useState, useEffect } from 'react';
import '../tailwind.css';
import ScoreCard from './ScoreCard';
import ScoreFlash from './ScoreFlash';
import GameControlButtons from './GameControlButtons';
import ScoreDisplay from './ScoreDisplay';
import CategoryButtons from './CategoryButtons';
import DiceControl from './DiceControl';
import ScoresSection from './ScoresSection';

import { calculateCurrentCategoryScore, calculateMaximumScore } from '../functions/scoreCalculator';
import { toggleHoldDie } from '../functions/diceLogic';
import { resetGame, startNewRound } from '../functions/gameControl';
import { ScoreEntry } from '../functions/types';
import { getDieSize, printDocument } from '../functions/utils';
import { useWindowSize } from '../hooks/useWindowSize';
import { handleRollDice } from '../functions/handleRollDice';
import { useAuth } from '../context/AuthContext';

interface GameProps {
  initialDice?: number[];
  isTwoPlayer: boolean;
}

const Game: React.FC<GameProps> = ({ initialDice = [1, 1, 1, 1, 1], isTwoPlayer }) => {
  const [dice, setDice] = useState(initialDice);
  const [heldDice, setHeldDice] = useState(new Set<number>());
  const [currentScore, setCurrentScore] = useState(0);
  const [player1ScoreHistory, setPlayer1ScoreHistory] = useState<ScoreEntry[]>([]);
  const [player2ScoreHistory, setPlayer2ScoreHistory] = useState<ScoreEntry[]>([]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [player1UsedCategories, setPlayer1UsedCategories] = useState(new Set<string>());
  const [player2UsedCategories, setPlayer2UsedCategories] = useState(new Set<string>());
  const [shouldShake, setShouldShake] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashCategory, setFlashCategory] = useState('');
  const { isUserSignedIn } = useAuth();

  const windowSize = useWindowSize();
  const dieSize = getDieSize(windowSize);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);

  useEffect(() => {
    if (player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) {
      setShowScoreCard(true);
    } else {
      setShowScoreCard(false);
    }
  }, [player1ScoreHistory, player2ScoreHistory]);

  const handleStartNewRound = () => {
    startNewRound(
      setDice,
      setRollsLeft,
      setHeldDice,
      setCurrentScore,
      setHasRolled,
      initialDice
    );
    if (isTwoPlayer) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  useEffect(() => {
    if (isTwoPlayer) {
      setTotalScore(currentPlayer === 1 ? player1TotalScore : player2TotalScore);
    }
  }, [currentPlayer, isTwoPlayer, player1TotalScore, player2TotalScore]);

  const updateScores = (newTotalScore: number) => {
    if (isTwoPlayer) {
      if (currentPlayer === 1) {
        setPlayer1TotalScore(newTotalScore);
      } else {
        setPlayer2TotalScore(newTotalScore);
      }
    } else {
      setTotalScore(newTotalScore);
    }
  };

  const getUsedCategories = () => {
    return currentPlayer === 1 ? player1UsedCategories : player2UsedCategories;
  };

  const setUsedCategories = (categories: Set<string> | ((prevCategories: Set<string>) => Set<string>)) => {
    if (currentPlayer === 1) {
      setPlayer1UsedCategories(categories as Set<string>);
    } else {
      setPlayer2UsedCategories(categories as Set<string>);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
      <h1 className="text-3xl mb-4">{isTwoPlayer ? `Player ${currentPlayer}'s Turn` : 'Single Player Mode'}</h1>
      <DiceControl
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={(index: number) => toggleHoldDie(index, heldDice, setHeldDice)}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
        usedCategoriesSize={getUsedCategories().size}
        onRollDice={() => handleRollDice(rollsLeft, dice, heldDice, setShouldShake, setHasRolled, setDice, setRollsLeft, setCurrentScore)}
      />
      <ScoreDisplay
        currentScore={calculateMaximumScore(dice, hasRolled, getUsedCategories())}
        totalScore={isTwoPlayer ? (currentPlayer === 1 ? player1TotalScore : player2TotalScore) : totalScore}
      />
      {hasRolled && <h2 className="text-2xl mb-2">Lock In Score:</h2>}
      <CategoryButtons
        dice={dice}
        hasRolled={hasRolled}
        usedCategories={getUsedCategories()}
        setUsedCategories={setUsedCategories}
        setTotalScore={updateScores as React.Dispatch<React.SetStateAction<number>>}
        totalScore={totalScore}
        setScoreHistory={currentPlayer === 1 ? setPlayer1ScoreHistory : setPlayer2ScoreHistory}
        scoreHistory={currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory}
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
        isTwoPlayer={isTwoPlayer}
        currentPlayer={currentPlayer}
        player1TotalScore={player1TotalScore}
        player2TotalScore={player2TotalScore}
        setPlayer1TotalScore={setPlayer1TotalScore}
        setPlayer2TotalScore={setPlayer2TotalScore}
      />
      <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
      {hasRolled && (
        <ScoresSection 
          dice={dice} 
          hasRolled={hasRolled} 
        />
      )}
      {showScoreCard && <h2 className="text-2xl mb-2">Score Card:</h2>}
      <div className="flex space-x-2">
        {showScoreCard && (
          <div className="flex space-x-8">
            <ScoreCard
              player1ScoreHistory={player1ScoreHistory}
              player2ScoreHistory={player2ScoreHistory}
              player1TotalScore={player1TotalScore}
              player2TotalScore={player2TotalScore}
              currentPlayer={1}
            />
            {isTwoPlayer && (
              <ScoreCard
                player1ScoreHistory={player1ScoreHistory}
                player2ScoreHistory={player2ScoreHistory}
                player1TotalScore={player1TotalScore}
                player2TotalScore={player2TotalScore}
                currentPlayer={2}
              />
            )}
          </div>
        )}
      </div>
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && (
        <GameControlButtons
          onResetGame={() => resetGame(
            setDice, setRollsLeft, setHeldDice, setCurrentScore, 
            setPlayer1ScoreHistory, setPlayer2ScoreHistory,
            setHasRolled, setTotalScore,
            setPlayer1TotalScore, setPlayer2TotalScore,
            initialDice, setPlayer1UsedCategories, setPlayer2UsedCategories
          )}
          onPrintDocument={printDocument}
          isMobile={windowSize < 640}
          totalScore={totalScore}
          usedCategories={getUsedCategories().size}
          isUserSignedIn={isUserSignedIn}
        />
      )}
      {isTwoPlayer && (
        <div className="flex space-x-8 mt-4">
          <div>
            <h2 className="text-xl">Player 1 Score: {player1TotalScore}</h2>
          </div>
          <div>
            <h2 className="text-xl">Player 2 Score: {player2TotalScore}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
