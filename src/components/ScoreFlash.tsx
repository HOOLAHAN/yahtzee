import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

interface ScoreFlashProps {
  category: string;
  duration?: number;
  show: boolean;
  onEnd: () => void;
}

const ScoreFlash: React.FC<ScoreFlashProps> = ({ category, duration = 2000, show, onEnd }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setIsVisible(false);
        onEnd();
      }, duration);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [show, duration, onEnd]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white text-2xl p-4 rounded shadow-lg animate-fadeInScaleUpFadeOut">
          <FontAwesomeIcon icon={faLock} className="pr-2" />
          {category.replace(/([A-Z])/g, ' $1').trim()}
      </div>
    </div>
  );
};

export default ScoreFlash;
