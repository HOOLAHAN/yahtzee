import { useAuth } from '../context/AuthContext';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  toggleAbout: () => void;
  toggleAuthModal: () => void;
  isUserSignedIn: boolean; 
  handleSignOut: () => void;
  toggleLeaderboard: () => void;
  toggleUserScores: () => void;
  toggleSettings?: () => void; 
  toggleTwoPlayerMode: () => void;
  isTwoPlayer: boolean;
}

const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
  toggleAbout,
  toggleLeaderboard,
  toggleAuthModal,
  isUserSignedIn,
  handleSignOut,
  toggleUserScores,
  toggleSettings,
  toggleTwoPlayerMode,
  isTwoPlayer
}) => {
  const { userDetails } = useAuth();

  const handleToggleTwoPlayerMode = () => {
    toggleTwoPlayerMode();
    onClose();
  };

  return (
    <div id="menu" className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 z-40 h-full w-64 bg-white shadow-lg transform transition-transform duration-300`}>
      <div className="relative p-4">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-xl text-gray-800 hover:text-gray-600"
          aria-label="Close menu"
        >
          &times;
        </button>
        <h2 className="font-semibold text-lg">Menu</h2>
        {isUserSignedIn && userDetails && (
          <div className="text-l mb-4">{userDetails.preferred_username} signed in</div>
        )}
        <button onClick={toggleAbout} className="mt-4 px-4 py-2 bg-green-500 text-white rounded block">About</button>
        <button onClick={toggleLeaderboard} className="mt-4 px-4 py-2 bg-red-500 text-white rounded block">Leaderboard</button>
        {isUserSignedIn && (
          <button onClick={toggleUserScores} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded block">My Scores</button>
        )}
        <button
          onClick={handleToggleTwoPlayerMode}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded block"
        >
          {isTwoPlayer ? 'Play Single Player' : 'Play Two Player'}
        </button>
        {isUserSignedIn && (
          <button onClick={toggleSettings} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded block">Settings</button>
        )}
        {!isUserSignedIn ? (
          <button
            onClick={toggleAuthModal}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded block"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded block"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Menu;
