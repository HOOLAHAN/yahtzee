// ScoreFlash.tsx

import React, { useEffect, useState } from 'react';

interface ScoreFlashProps {
  category: string;
  duration?: number;
  show: boolean;
  onEnd: () => void;
}

const ScoreFlash: React.FC<ScoreFlashProps> = ({ category, duration = 2000, show, onEnd }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        onEnd();
      }, duration);
    }
  }, [show, duration, onEnd]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white text-2xl p-4 rounded shadow-lg">
      {category.replace(/([A-Z])/g, ' $1').trim()}
    </div>
  );
};

export default ScoreFlash;
