import { useAuth } from '../../context/AuthContext';

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
  isTwoPlayer,
}) => {
  const { userDetails } = useAuth();

  const handleToggleTwoPlayerMode = () => {
    toggleTwoPlayerMode();
    onClose();
  };

  return (
    <div
      id="menu"
      className={`${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } fixed right-0 top-0 z-40 h-full w-64 bg-deepBlack text-mintGlow shadow-xl transform transition-transform duration-300`}
    >
      <div className="flex flex-col h-full justify-between p-6">
        {/* Header with close button */}
        <div>
          <div className="flex items-center justify-between mb-6 animate-pulse-glow">
            <h2 className="text-3xl font-bold text-neonYellow">Menu</h2>
            <button
              onClick={onClose}
              className="text-3xl text-neonCyan hover:text-electricPink"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>

          {isUserSignedIn && userDetails && (
            <div className="mb-4 text-sm text-electricPink">
              {userDetails.preferred_username} signed in
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={toggleAbout}
              className="px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
            >
              About
            </button>
            <button
              onClick={toggleLeaderboard}
              className="px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
            >
              Leaderboard
            </button>
            {isUserSignedIn && (
              <button
                onClick={toggleUserScores}
                className="px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
              >
                My Scores
              </button>
            )}
            <button
              onClick={handleToggleTwoPlayerMode}
              className="px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
            >
              {isTwoPlayer ? 'Play Single Player' : 'Play Two Player'}
            </button>
            {isUserSignedIn && toggleSettings && (
              <button
                onClick={toggleSettings}
                className="px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
              >
                Settings
              </button>
            )}
          </div>
        </div>

        {/* Auth Section */}
        <div className="mt-6">
          {!isUserSignedIn ? (
            <button
              onClick={toggleAuthModal}
              className="w-full px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 rounded-xl font-semibold text-black bg-neonCyan hover:bg-electricPink transition hover:scale-105"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
