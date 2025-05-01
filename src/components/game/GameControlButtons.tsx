// GameControlButtons.tsx

import CreateScoreButton from './CreateScoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useLeaderboardRefresh } from '../../context/LeaderboardRefreshContext';
import { printDocument } from '../../lib/utils'; 

interface GameControlButtonsProps {
  onResetGame: () => void;
  onPrintDocument: () => void;
  isMobile: boolean;
  totalScore: number;
  usedCategories: number;
  isUserSignedIn: boolean;
  isTwoPlayer: boolean; 
}

const GameControlButtons: React.FC<GameControlButtonsProps> = ({ onResetGame, isMobile, totalScore, usedCategories, isUserSignedIn, isTwoPlayer }) => {
  const { toggleRefreshLeaderboard } = useLeaderboardRefresh();

  return (
    <div className="flex space-x-2 mt-4">
      <button 
        className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2"
        onClick={onResetGame}
      >
        {isMobile ? "Reset" : "Reset Game"}
      </button>
      { usedCategories === 13 && 
      <button 
        className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
        onClick={() => printDocument(isTwoPlayer)}
      >
        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
        {isMobile ? "" : "Score Card"}
      </button> 
      }
      { usedCategories === 13 && isUserSignedIn && !isTwoPlayer && 
      <CreateScoreButton score={totalScore} isMobile={isMobile} onClick={toggleRefreshLeaderboard} />
      }
    </div>
  )
};

export default GameControlButtons;
