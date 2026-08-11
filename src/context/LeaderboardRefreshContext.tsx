import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LeaderboardRefreshContextType {
  refreshLeaderboard: boolean;
  toggleRefreshLeaderboard: () => void;
}

const LeaderboardRefreshContext = createContext<LeaderboardRefreshContextType | undefined>(undefined);

export const useLeaderboardRefresh = () => {
  const context = useContext(LeaderboardRefreshContext);
  if (context === undefined) {
    throw new Error('useLeaderboardRefresh must be used within a LeaderboardRefreshProvider');
  }
  return context;
}

// Leaf components such as Game are also rendered in isolation by tests and
// previews. They may request a refresh without requiring the full app shell.
export const useOptionalLeaderboardRefresh = () => useContext(LeaderboardRefreshContext);

interface LeaderboardRefreshProviderProps {
  children: ReactNode;
}

export const LeaderboardRefreshProvider: React.FC<LeaderboardRefreshProviderProps> = ({ children }) => {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState<boolean>(false);

  const toggleRefreshLeaderboard = () => {
    setRefreshLeaderboard(prev => !prev);
  };

  return (
    <LeaderboardRefreshContext.Provider value={{ refreshLeaderboard, toggleRefreshLeaderboard }}>
      {children}
    </LeaderboardRefreshContext.Provider>
  );
};
