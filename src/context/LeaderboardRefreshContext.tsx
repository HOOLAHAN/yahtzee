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
