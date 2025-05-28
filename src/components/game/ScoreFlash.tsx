import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

interface ScoreFlashProps {
  category: string;
  duration?: number;
  show: boolean;
  onEnd: () => void;
}

const ScoreFlash: React.FC<ScoreFlashProps> = ({ category, duration = 1500, show, onEnd }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onEnd();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onEnd]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-deepBlack text-neonCyan text-3xl sm:text-4xl font-bold px-6 py-4 rounded-xl border-2 border-neonCyan shadow-lg animate-ping-glow">
        <FontAwesomeIcon icon={faLock} className="text-electricPink pr-3" />
        {category.replace(/([A-Z])/g, ' $1').trim()}
      </div>
    </div>
  );
};

export default ScoreFlash;
