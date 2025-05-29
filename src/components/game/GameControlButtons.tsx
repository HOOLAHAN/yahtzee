import CreateScoreButton from './CreateScoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';
import { shareScorecard } from '../../lib/utils'; 

interface GameControlButtonsProps {
  onResetGame: () => void;
  onShareScorecard: () => void;
  isMobile: boolean;
  totalScore: number;
  usedCategories: number;
  isUserSignedIn: boolean;
  isTwoPlayer: boolean; 
}

const GameControlButtons: React.FC<GameControlButtonsProps> = ({
  onResetGame,
  isMobile,
  totalScore,
  usedCategories,
  isUserSignedIn,
  isTwoPlayer,
}) => {
  const { toggleRefreshLeaderboard } = useLeaderboardRefresh();

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 mb-10">
      {/* Reset Game Button */}
      <button 
        className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'} rounded-md font-bold text-red-400 border border-red-500 bg-deepBlack
            hover:text-white hover:bg-red-800 hover:border-red-400
            transition duration-300 transform hover:scale-105 shadow-[0_0_10px_#ff0000]`}
        onClick={onResetGame}
      >
        {isMobile ? "Reset" : "Reset Game"}
      </button>

      {/* Share Score Card Button */}
      <button 
        className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'} rounded-md font-bold text-deepBlack bg-neonYellow
            hover:brightness-110 transition duration-300 transform hover:scale-105 
            shadow-[0_0_10px_#faff00]`}
        onClick={() => shareScorecard(isTwoPlayer)}
      >
        <FontAwesomeIcon icon={faShareNodes} className="mr-2" />
        {isMobile ? "Share" : "Share Scorecard"}
      </button>

      {/* Submit Score to Leaderboard Button */}
      {usedCategories === 13 && isUserSignedIn && !isTwoPlayer && (
        <CreateScoreButton
          score={totalScore}
          isMobile={isMobile}
          onClick={toggleRefreshLeaderboard}
        />
      )}
    </div>
  );
};

export default GameControlButtons;
