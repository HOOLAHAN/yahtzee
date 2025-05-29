// About.tsx

import React from 'react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <section
      className="m-4 p-6 sm:p-8 h-full overflow-y-auto relative animate-fadeIn bg-deepBlack text-neonCyan border border-neonCyan rounded-xl shadow-lg"
      aria-labelledby="about-title"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-3xl text-electricPink hover:text-neonYellow transition"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 id="about-title" className="text-3xl font-bold mb-4 text-neonYellow text-center">
        About <span className="text-electricPink">Yahtzee</span>
      </h2>

      <p className="mb-4 leading-relaxed">
        🎲 <span className="text-neonYellow font-semibold">Yahtzee</span> is a classic dice game played with five six-sided dice.
        The goal is to roll the best combinations and rack up the highest score!
      </p>

      <h3 className="text-2xl text-electricPink font-semibold mt-6 mb-2 underline underline-offset-4">How to Play</h3>
      <ul className="list-disc list-inside space-y-1 pl-4 text-mintGlow">
        <li>🎯 Roll all five dice at the start of your turn.</li>
        <li>🛑 Hold any dice to lock them before your next roll.</li>
        <li>🔁 You can re-roll the unheld dice up to two more times.</li>
        <li>📋 After your rolls, choose a scoring category. Each one can be used only once!</li>
      </ul>

      <h3 className="text-2xl text-electricPink font-semibold mt-6 mb-2 underline underline-offset-4">Scoring Categories</h3>
      <ul className="list-disc list-inside space-y-1 pl-4 text-mintGlow">
        <li><span className="text-neonYellow">Ones - Sixes:</span> Add up all dice showing the number.</li>
        <li><span className="text-neonYellow">Three of a Kind:</span> Total of all dice if 3+ are the same.</li>
        <li><span className="text-neonYellow">Four of a Kind:</span> Total of all dice if 4+ are the same.</li>
        <li><span className="text-neonYellow">Full House:</span> 3 of one number + 2 of another = 25 points.</li>
        <li><span className="text-neonYellow">Small Straight:</span> 4 consecutive numbers = 30 points.</li>
        <li><span className="text-neonYellow">Large Straight:</span> 5 consecutive numbers = 40 points.</li>
        <li><span className="text-neonYellow">Yahtzee:</span> All five dice the same = 50 points!</li>
        <li><span className="text-neonYellow">Chance:</span> Add up all dice — no conditions!</li>
      </ul>

      <p className="mt-4 text-neonCyan">
        💡 <span className="text-electricPink font-semibold">Strategy Tip:</span> Timing your category selections wisely can make or break your final score!
      </p>

      <p className="mt-4 text-neonCyan">
        🔒 <strong className="text-neonYellow">Signed in?</strong> Submit your score to the leaderboard and see how you rank against other players!
      </p>

      <p className="mt-4 text-center text-electricPink text-lg font-semibold">Good luck and happy rolling! 🎲✨</p>
    </section>
  );
};

export default About;
