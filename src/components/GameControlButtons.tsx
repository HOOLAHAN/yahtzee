// GameControlButtons.tsx

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

interface GameControlButtonsProps {
  onResetGame: () => void;
  onPrintDocument: () => void;
  isMobile: boolean;
}

const GameControlButtons: React.FC<GameControlButtonsProps> = ({ onResetGame, onPrintDocument, isMobile }) => (
  <div className="flex space-x-2 mt-4">
    <button 
      className="transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 w-full md:w-auto bg-red-600 text-white rounded hover:bg-red-700 focus:ring focus:ring-red-200 mb-2"
      onClick={onResetGame}
    >
      {isMobile ? "Reset" : "Reset Game"}
    </button>
    <button 
      className="w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring focus:ring-blue-200 mb-2 mr-2"
      onClick={onPrintDocument}
    >
      <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
      {isMobile ? "" : "Score Card"}
    </button> 
  </div>
);

export default GameControlButtons