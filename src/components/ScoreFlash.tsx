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
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white text-2xl p-4 rounded shadow-lg animate-fadeInScaleUpFadeOut">
          {category.replace(/([A-Z])/g, ' $1').trim()}
      </div>
    </div>
  );  
  
};

export default ScoreFlash;
