import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-2">About Yahtzee</h2>
      <p>
        Yahtzee is a classic dice game played with five six-sided dice.
        The objective of the game is to score points by rolling certain combinations.
      </p>
      <h3 className="text-xl font-semibold mt-4">How to Play</h3>
      <ul className="list-disc list-inside">
        <li>Roll the five dice.</li>
        <li>After each roll, you can choose to hold any number of dice to keep their current face value for subsequent rolls.</li>
        <li>After three rolls, you must select a scoring category for your roll.</li>
        <li>The game continues until all scoring categories have been used.</li>
      </ul>
    </div>
  );
};

export default About;
