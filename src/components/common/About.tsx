// About.tsx

import React from 'react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  return (
    <section
      className="p-6 sm:p-8 h-full overflow-y-auto relative animate-fadeIn"
      aria-labelledby="about-title"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-3xl text-white hover:text-gray-300"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 id="about-title" className="text-2xl sm:text-3xl font-semibold mb-2 text-white">
        About Yahtzee
      </h2>

      <p className="text-white">
        Yahtzee is a classic dice game played with five six-sided dice.
        The objective of the game is to score points by rolling certain combinations.
      </p>

      <h3 className="text-xl font-semibold mt-4 text-white">How to Play</h3>
      <ul className="list-disc list-inside text-white">
        <li>At the start of each turn, you roll all five dice.</li>
        <li>After each roll, you have the option to hold any number of dice. When you hold a die, its face value is locked for subsequent rolls.</li>
        <li>You can re-roll the remaining, unheld dice up to two more times, for a total of three rolls per turn.</li>
        <li>After three rolls, you must select a scoring category for your roll. The game continues until all scoring categories have been used once.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4 text-white">Scoring Categories</h3>
      <ul className="list-disc list-inside text-white">
        <li>Ones through Sixes: Score the sum of all the dice showing the number 1 through 6, respectively.</li>
        <li>Three-Of-A-Kind: Score the sum of all dice if at least three dice show the same number.</li>
        <li>Four-Of-A-Kind: Score the sum of all dice if at least four dice show the same number.</li>
        <li>Full House: Score 25 points for a roll containing a three-of-a-kind and a pair.</li>
        <li>Small Straight: Score 30 points for a roll containing a sequence of four consecutive numbers (e.g., 1-2-3-4).</li>
        <li>Large Straight: Score 40 points for a roll containing a sequence of five consecutive numbers (e.g., 1-2-3-4-5 or 2-3-4-5-6).</li>
        <li>Yahtzee: Score 50 points for a roll in which all five dice show the same number.</li>
        <li>Chance: Score the sum of all five dice, regardless of what numbers they show.</li>
      </ul>

      <p className="text-white mt-4">
        Each category can be used only once during the game. The strategy lies in deciding when to use each category based on the current roll, as optimising these decisions can significantly influence your final score.
      </p>

      <p className="text-white mt-4">
        <strong>Note:</strong> Once the game is complete, if you are signed in, you have the option to submit your score to the leaderboard. This allows you to compete with other players and see where your score stands among the community. Don't miss out on the opportunity to make your mark!
      </p>

      <p className="text-white mt-4">Good luck and happy rolling!</p>
    </section>
  );
};

export default About;
