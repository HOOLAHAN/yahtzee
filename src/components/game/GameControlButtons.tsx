import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { shareScorecard } from '../../lib/utils'; 

interface GameControlButtonsProps {
  isMobile: boolean;
  isTwoPlayer: boolean; 
  gameComplete?: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  showAccountPrompt?: boolean;
  onCreateAccount?: () => void;
}

const GameControlButtons: React.FC<GameControlButtonsProps> = ({
  isMobile,
  isTwoPlayer,
  gameComplete = false,
  saveStatus = 'idle',
  showAccountPrompt = false,
  onCreateAccount,
}) => {
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

      {gameComplete && saveStatus !== 'idle' && (
        <p className={`w-full text-center text-sm font-bold ${saveStatus === 'error' ? 'text-red-400' : 'text-mintGlow'}`} aria-live="polite">
          {saveStatus === 'saving' ? 'Saving score…' : saveStatus === 'saved' ? 'Score saved automatically' : 'Score could not be saved — retrying…'}
        </p>
      )}
      {showAccountPrompt && (
        <div className="web-panel w-full max-w-xl p-5 text-center">
          <strong className="block text-xl text-neonYellow">Keep this result</strong>
          <p className="mt-1 text-sm text-mintGlow">Create a free player profile and this finished game will be saved automatically.</p>
          <button type="button" onClick={onCreateAccount} className="mt-4 rounded-xl bg-neonCyan px-5 py-3 font-black text-deepBlack transition hover:bg-neonYellow">Create player profile</button>
        </div>
      )}
    </div>
  );
};

export default GameControlButtons;
