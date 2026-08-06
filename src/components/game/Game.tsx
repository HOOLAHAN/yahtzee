import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faList, faLock, faRotate } from '@fortawesome/free-solid-svg-icons';
import '../../styles/tailwind.css';
import ScoreCard from './ScoreCard';
import ScoreFlash from './ScoreFlash';
import GameControlButtons from './GameControlButtons';
import ScoreDisplay from './ScoreDisplay';
import CategoryButtons from './CategoryButtons';
import DiceControl from './DiceControl';

import { calculateCurrentCategoryScore, calculateMaximumScore } from '../../lib/scoreCalculator';
import { toggleHoldDie } from '../../lib/diceLogic';
import { lockInScore, resetGame, startNewRound } from '../../lib/gameControl';
import { Category, ScoreEntry } from '../../lib/types';
import { getDieSize } from '../../lib/utils';
import { useWindowSize } from '../../hooks/useWindowSize';
import { handleRollDice } from '../../lib/handleRollDice';
import { useAuth } from '../../context/AuthContext';
import { dailyDiceForThrow, utcDateKey } from '../../lib/dailyChallenge';
import { createGameResult, fetchDailyResults, resultMetrics } from '../../services/gameResults';

interface GameProps {
  initialDice?: number[];
  isTwoPlayer: boolean;
  setIsTwoPlayer: (isTwoPlayer: boolean) => void;
  testOverrideDice?: number[];
  isComputerOpponent?: boolean;
  isDailyChallenge?: boolean;
  scoreSuggestionsEnabled?: boolean;
}

const defaultDice = [1, 1, 1, 1, 1];
const computerCategories: Category[] = ['Ones','Twos','Threes','Fours','Fives','Sixes','ThreeOfAKind','FourOfAKind','FullHouse','SmallStraight','LargeStraight','Yahtzee','Chance'];
const upperCategories: Category[] = ['Ones','Twos','Threes','Fours','Fives','Sixes'];
const playerProfiles = [
  { accent: '#00f0f0', score: '#f4ff00', soft: '#173033' },
  { accent: '#5cff88', score: '#9dffb7', soft: '#173322' },
] as const;

const chooseComputerHolds = (computerDice: number[], used: Set<string>) => {
  const counts = computerDice.reduce<Record<number, number>>((result, die) => ({ ...result, [die]: (result[die] || 0) + 1 }), {});
  const grouped = Object.entries(counts).map(([face, count]) => [Number(face), count] as const).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const [bestFace, bestCount] = grouped[0];
  const matchingUpper = upperCategories[bestFace - 1];
  const straightOpen = !used.has('SmallStraight') || !used.has('LargeStraight');
  const runs = [[1,2,3,4,5], [2,3,4,5,6]];
  const target = runs.reduce((best, run) => run.filter((face) => computerDice.includes(face)).length > best.filter((face) => computerDice.includes(face)).length ? run : best);
  const straightMatches = target.filter((face) => computerDice.includes(face)).length;
  const groupOpen = !used.has(matchingUpper) || ['ThreeOfAKind','FourOfAKind','Yahtzee'].some((category) => !used.has(category));
  const fullHouseOpen = !used.has('FullHouse');
  const holdFace = (face: number) => new Set(computerDice.map((die, index) => die === face ? index : -1).filter((index) => index >= 0));
  const holdStraight = () => { const seen = new Set<number>(); return new Set(computerDice.map((die, index) => target.includes(die) && !seen.has(die) ? (seen.add(die), index) : -1).filter((index) => index >= 0)); };

  if (bestCount >= 4 && groupOpen) return holdFace(bestFace);
  if (straightOpen && straightMatches >= 4) return holdStraight();
  if (fullHouseOpen && grouped[0][1] >= 2 && grouped[1]?.[1] >= 2) {
    const usefulFaces = new Set(grouped.filter(([, count]) => count >= 2).map(([face]) => face));
    return new Set(computerDice.map((die, index) => usefulFaces.has(die) ? index : -1).filter((index) => index >= 0));
  }
  if (bestCount >= 3 && groupOpen) return holdFace(bestFace);
  if (straightOpen && straightMatches >= 3) return holdStraight();
  if (bestCount >= 2 && (groupOpen || fullHouseOpen)) return holdFace(bestFace);
  if (straightOpen && straightMatches >= 2) return holdStraight();
  return new Set(computerDice.map((die, index) => die >= 5 ? index : -1).filter((index) => index >= 0));
};

const sacrificeCost: Record<Category, number> = { Ones:4, Twos:8, Threes:12, Fours:16, Fives:20, Sixes:24, ThreeOfAKind:28, FourOfAKind:24, FullHouse:22, SmallStraight:26, LargeStraight:32, Yahtzee:18, Chance:34 };
const computerCategoryValue = (category: Category, computerDice: number[], entries: ScoreEntry[]) => {
  const score = calculateCurrentCategoryScore(category, computerDice);
  if (score === 0) return -sacrificeCost[category];
  if (category === 'Yahtzee') return 1200;
  if (category === 'LargeStraight') return 1000;
  if (category === 'FullHouse') return 800;
  if (category === 'SmallStraight') return 700;
  if (category === 'FourOfAKind') return 420 + score;
  if (category === 'ThreeOfAKind') return 300 + score;
  if (category === 'Chance') return 120 + score * 4;
  const upperSubtotal = entries.filter((entry) => upperCategories.includes(entry.category as Category)).reduce((sum, entry) => sum + entry.roundScore, 0);
  const face = upperCategories.indexOf(category) + 1;
  const matchingDice = face > 0 ? score / face : 0;
  return 180 + score * 5 + matchingDice * 12 + (upperSubtotal < 63 && matchingDice >= 3 ? 35 : 0);
};
const chooseComputerCategory = (computerDice: number[], used: Set<string>, entries: ScoreEntry[]) => computerCategories.filter((category) => !used.has(category)).reduce((best, category) => computerCategoryValue(category, computerDice, entries) > computerCategoryValue(best, computerDice, entries) ? category : best);

const Game: React.FC<GameProps> = ({ initialDice = defaultDice, isTwoPlayer, setIsTwoPlayer, testOverrideDice, isComputerOpponent = false, isDailyChallenge = false, scoreSuggestionsEnabled = true }) => {
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
  const { isUserSignedIn, userDetails } = useAuth();
  const [dailyDate] = useState(utcDateKey);
  const [dailyThrowIndex, setDailyThrowIndex] = useState(0);
  const [progressRecorded, setProgressRecorded] = useState(false);
  const [yahtzeeOnFinalRoll, setYahtzeeOnFinalRoll] = useState(false);
  const [dailyStanding, setDailyStanding] = useState('');
  const gameId = useRef(`web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);

  const windowSize = useWindowSize();
  const dieSize = getDieSize(windowSize);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);
  const [currentMobileScoreCard, setCurrentMobileScoreCard] = useState(currentPlayer);
  const [computerThinking, setComputerThinking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const computerRunning = useRef(false);

  useEffect(() => {
    if (!isComputerOpponent || currentPlayer !== 2 || computerRunning.current || player2UsedCategories.size >= 13) return;
    let cancelled = false;
    const play = async () => {
      computerRunning.current = true; setComputerThinking(true);
      let computerDice = initialDice;
      let computerHeld = new Set<number>();
      for (let roll = 0; roll < 3; roll += 1) {
        // Keep each roll and decision visible so the opponent feels like it
        // is taking a turn rather than instantly calculating a result.
        await new Promise((resolve) => setTimeout(resolve, roll === 0 ? 700 : 900));
        if (!cancelled) setShouldShake(true);
        await new Promise((resolve) => setTimeout(resolve, 850));
        const nextDice = [...computerDice];
        for (let index = 0; index < nextDice.length; index += 1) {
          if (!computerHeld.has(index)) nextDice[index] = Math.floor(Math.random() * 6) + 1;
        }
        computerDice = nextDice;
        if (!cancelled) { setShouldShake(false); setDice(computerDice); setHeldDice(computerHeld); setHasRolled(true); setRollsLeft(2 - roll); }
        if (roll < 2) {
          const strongCategory = chooseComputerCategory(computerDice, player2UsedCategories, player2ScoreHistory);
          if (['LargeStraight','FullHouse','Yahtzee'].includes(strongCategory) && calculateCurrentCategoryScore(strongCategory, computerDice) > 0) break;
          computerHeld = chooseComputerHolds(computerDice, player2UsedCategories);
          if (!cancelled) setHeldDice(computerHeld);
        }
      }
      if (cancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 1100));
      if (cancelled) return;
      const category = chooseComputerCategory(computerDice, player2UsedCategories, player2ScoreHistory);
      const points = calculateCurrentCategoryScore(category, computerDice);
      setPlayer2UsedCategories((used) => new Set(used).add(category));
      setPlayer2ScoreHistory((history) => [...history, { category, dice: computerDice, roundScore: points }]);
      setPlayer2TotalScore((value) => value + points);
      setFlashCategory(category); setShowFlash(true);
      startNewRound(setDice, setRollsLeft, setHeldDice, setCurrentScore, setHasRolled, initialDice);
      setCurrentPlayer(1); computerRunning.current = false; setComputerThinking(false);
    };
    void play();
    return () => { cancelled = true; setShouldShake(false); };
  }, [currentPlayer, initialDice, isComputerOpponent, player2ScoreHistory, player2UsedCategories]);

  useEffect(() => {
    setCurrentMobileScoreCard(currentPlayer);
  }, [currentPlayer]);

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

  const handleResetGame = () => {
    setSelectedCategory(null); setShowScoreCard(false); setDailyThrowIndex(0); setProgressRecorded(false); setYahtzeeOnFinalRoll(false); setDailyStanding(''); gameId.current = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    resetGame(
      setDice, setRollsLeft, setHeldDice, setCurrentScore, 
      setPlayer1ScoreHistory, setPlayer2ScoreHistory,
      setHasRolled, setTotalScore,
      setPlayer1TotalScore, setPlayer2TotalScore,
      initialDice, setPlayer1UsedCategories, setPlayer2UsedCategories
    );
  };

  useEffect(() => {
    if (isTwoPlayer) {
      setTotalScore(currentPlayer === 1 ? player1TotalScore : player2TotalScore);
    }
  }, [currentPlayer, isTwoPlayer, player1TotalScore, player2TotalScore]);

  useEffect(() => {
    if (testOverrideDice && hasRolled) {
      setDice(testOverrideDice);
    }
  }, [testOverrideDice, hasRolled]);

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

  const handleScoreLockIn = (category: string) => {
    setFlashCategory(category);
    setShowFlash(true);
  };

  const handleConfirmScore = () => {
    if (!selectedCategory) return;
    if (selectedCategory === 'Yahtzee' && calculateCurrentCategoryScore(selectedCategory, dice) === 50 && rollsLeft === 0) setYahtzeeOnFinalRoll(true);
    lockInScore(selectedCategory, getUsedCategories(), setUsedCategories, dice, updateScores as React.Dispatch<React.SetStateAction<number>>, totalScore, currentPlayer === 1 ? setPlayer1ScoreHistory : setPlayer2ScoreHistory, currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory, handleStartNewRound, setCurrentScore, setHasRolled, setDice, setRollsLeft, setHeldDice, initialDice, currentScore, calculateCurrentCategoryScore, isTwoPlayer, currentPlayer, player1TotalScore, player2TotalScore, setPlayer1TotalScore, setPlayer2TotalScore);
    handleScoreLockIn(selectedCategory); setSelectedCategory(null);
  };

  const currentTotal = isTwoPlayer ? (currentPlayer === 1 ? player1TotalScore : player2TotalScore) : totalScore;
  const round = Math.min(getUsedCategories().size + 1, 13);
  const currentProfile = currentPlayer === 1 ? playerProfiles[0] : playerProfiles[1];
  const gameComplete = player1UsedCategories.size === 13 && (!isTwoPlayer || player2UsedCategories.size === 13);

  useEffect(() => {
    if (!gameComplete || progressRecorded || isTwoPlayer || !isUserSignedIn || !userDetails?.userId) return;
    const metrics = resultMetrics(player1ScoreHistory);
    void createGameResult({
      id: isDailyChallenge ? `daily:${dailyDate}:${userDetails.userId}` : gameId.current,
      mode: isDailyChallenge ? 'DAILY' : 'SOLO',
      modeDate: isDailyChallenge ? `DAILY#${dailyDate}` : 'SOLO#ALL',
      challengeDate: isDailyChallenge ? dailyDate : undefined,
      completedAt: new Date().toISOString(), ...metrics, yahtzeeOnFinalRoll,
    }).then(async (savedResult) => { setProgressRecorded(true); if (isDailyChallenge) { const board = await fetchDailyResults(dailyDate); const rank = board.findIndex((result) => result.userId === savedResult.userId) + 1; if (rank > 0) setDailyStanding(`#${rank} today · Top ${Math.max(1, Math.ceil((rank / board.length) * 100))}%`); } }).catch((error) => { if (isDailyChallenge && /ConditionalCheckFailed|conditional request|already exists/i.test(error instanceof Error ? error.message : String(error))) setProgressRecorded(true); else console.error('[gameResults.create]', error); });
  }, [dailyDate, gameComplete, isDailyChallenge, isTwoPlayer, isUserSignedIn, player1ScoreHistory, progressRecorded, userDetails?.userId, yahtzeeOnFinalRoll]);

  return (
    <div className="web-player-profile mx-auto min-h-screen w-full max-w-6xl bg-deepBlack px-4 py-5 text-mintGlow md:px-8" style={{ '--player-accent': currentProfile.accent, '--player-score': currentProfile.score, '--player-soft': currentProfile.soft } as React.CSSProperties}>
      <div className="web-game-heading"><div><h1
        className="text-3xl font-black animate-pulse-glow"
        style={{ color: currentProfile.accent }}
      >
        {isComputerOpponent ? (currentPlayer === 1 ? 'Your Turn' : 'Computer’s Turn') : isTwoPlayer ? `Player ${currentPlayer}'s Turn` : 'Your Turn'}
      </h1><p>{isDailyChallenge ? `${dailyDate} · ` : ''}Round {round} of 13{computerThinking ? ' · Computer is thinking' : ''}</p></div><button onClick={() => setShowScoreCard(true)} className="scorecard-trigger"><FontAwesomeIcon icon={faList} /> Scorecard</button></div>
      {dailyStanding && <div className="mb-4 rounded-xl border border-neonYellow bg-[#272b13] px-4 py-3 text-center font-black text-neonYellow">{dailyStanding}</div>}
      <section className="web-play-panel">
      <DiceControl
        dice={dice}
        heldDice={heldDice}
        toggleHoldDie={(index: number) => !computerThinking && toggleHoldDie(index, heldDice, setHeldDice)}
        rollsLeft={rollsLeft}
        hasRolled={hasRolled}
        shouldShake={shouldShake}
        dieSize={dieSize}
        usedCategoriesSize={getUsedCategories().size}
        onRollDice={() => { if (computerThinking || shouldShake) return; const rollValues = isDailyChallenge ? dailyDiceForThrow(dailyDate, dailyThrowIndex) : undefined; if (isDailyChallenge) setDailyThrowIndex((index) => index + 1); handleRollDice(rollsLeft, dice, heldDice, setShouldShake, setHasRolled, setDice, setRollsLeft, setCurrentScore, rollValues); }}
      />
      <ScoreDisplay
        currentScore={calculateMaximumScore(dice, hasRolled, getUsedCategories())}
        totalScore={currentTotal}
        showSuggestion={scoreSuggestionsEnabled}
      />
      </section>
      <div className="category-heading"><div><h2>Choose a category</h2><p>{hasRolled ? 'Tap once to preview, then lock it in.' : 'Categories unlock after your first roll.'}</p></div><span>13 categories</span></div>
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
        handleScoreLockIn={handleScoreLockIn}
        setShowFlash={setShowFlash}
        isTwoPlayer={isTwoPlayer}
        currentPlayer={currentPlayer}
        player1TotalScore={player1TotalScore}
        player2TotalScore={player2TotalScore}
        setPlayer1TotalScore={setPlayer1TotalScore}
        setPlayer2TotalScore={setPlayer2TotalScore}
        showAll
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ScoreFlash category={flashCategory} show={showFlash} onEnd={() => setShowFlash(false)} />
      {selectedCategory && <div className="web-lock-bar"><div><small>{selectedCategory.replace(/([A-Z])/g, ' $1').trim()}</small><strong>{calculateCurrentCategoryScore(selectedCategory, dice)} points</strong></div><button onClick={handleConfirmScore}><FontAwesomeIcon icon={faLock} /> Lock In</button></div>}
      {showScoreCard && <div className="fixed inset-0 z-50 bg-black/80 p-3 backdrop-blur-sm sm:p-6" onClick={() => setShowScoreCard(false)}><section className="scorecard-modal" onClick={(event) => event.stopPropagation()}><div className="scorecard-modal-header"><div><p className="eyebrow">Round {round} of 13</p><h2>Scorecard</h2></div><button onClick={() => setShowScoreCard(false)} aria-label="Close scorecard">&times;</button></div><div className="overflow-y-auto px-4 pb-6 sm:px-6">
        {(
          windowSize < 1050 ? (
            <div className="relative p-4 w-full">
              <ScoreCard
                player1ScoreHistory={player1ScoreHistory}
                player2ScoreHistory={player2ScoreHistory}
                player1TotalScore={player1TotalScore}
                player2TotalScore={player2TotalScore}
                currentPlayer={currentMobileScoreCard}
                isTwoPlayer={isTwoPlayer}
              />
              {isTwoPlayer && (
                <center>
                  <button
                    onClick={() => setCurrentMobileScoreCard(currentMobileScoreCard === 1 ? 2 : 1)}
                    className="player-switch mt-4 mx-auto font-bold py-2 px-4 rounded-full w-20 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={currentMobileScoreCard === 1 ? faArrowRight : faArrowLeft} />
                  </button>
                </center>
              )}
            </div>
          ) : (
            <div className="flex w-full space-x-8">
              <div className="flex-1">
                <ScoreCard
                  player1ScoreHistory={player1ScoreHistory}
                  player2ScoreHistory={player2ScoreHistory}
                  player1TotalScore={player1TotalScore}
                  player2TotalScore={player2TotalScore}
                  currentPlayer={1}
                  isTwoPlayer={isTwoPlayer}
                />
              </div>
              {isTwoPlayer && (
                <div className="flex-1">
                  <ScoreCard
                    player1ScoreHistory={player1ScoreHistory}
                    player2ScoreHistory={player2ScoreHistory}
                    player1TotalScore={player1TotalScore}
                    player2TotalScore={player2TotalScore}
                    currentPlayer={2}
                    isTwoPlayer={isTwoPlayer}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div></section></div>}
      {isTwoPlayer && (
        <div className="web-player-totals">
          <span>You <strong>{player1TotalScore}</strong></span><span>{isComputerOpponent ? 'Computer' : 'Player 2'} <strong>{player2TotalScore}</strong></span>
        </div>
      )}
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && (
        <GameControlButtons
          isMobile={windowSize < 640}
          totalScore={totalScore}
          usedCategories={getUsedCategories().size}
          isUserSignedIn={isUserSignedIn}
          isTwoPlayer={isTwoPlayer}
          allowScoreSubmission={!isTwoPlayer || isComputerOpponent}
          gameComplete={gameComplete}
        />
      )}
      {(player1ScoreHistory.length > 0 || player2ScoreHistory.length > 0) && <button onClick={handleResetGame} className="web-reset"><FontAwesomeIcon icon={faRotate} /> Reset game</button>}
    </div>
  );
};

export default Game;
