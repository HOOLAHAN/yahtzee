import CreateScoreButton from './CreateScoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';
import { shareScorecard } from '../../lib/utils'; 

interface GameControlButtonsProps {
  isMobile: boolean;
  totalScore: number;
  usedCategories: number;
  isUserSignedIn: boolean;
  isTwoPlayer: boolean; 
  allowScoreSubmission?: boolean;
  gameComplete?: boolean;
}

const GameControlButtons: React.FC<GameControlButtonsProps> = ({
  isMobile,
  totalScore,
  usedCategories,
  isUserSignedIn,
  isTwoPlayer,
  allowScoreSubmission = false,
  gameComplete = false,
}) => {
  const { toggleRefreshLeaderboard } = useLeaderboardRefresh();

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 mb-10">
      {/* Share Score Card Button */}
      {gameComplete && <button
        className={`${isMobile ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'} rounded-md font-bold text-deepBlack bg-neonYellow
            hover:brightness-110 transition duration-300 transform hover:scale-105 
            shadow-[0_0_10px_#faff00]`}
        onClick={() => shareScorecard(isTwoPlayer)}
      >
        <FontAwesomeIcon icon={faShareNodes} className="mr-2" />
        {isMobile ? "Share" : "Share Scorecard"}
      </button>}

      {/* Submit Score to Leaderboard Button */}
      {usedCategories === 13 && isUserSignedIn && allowScoreSubmission && (
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
