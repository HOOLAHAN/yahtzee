// ScoreCard.tsx

import React from 'react';
import { ScoreEntry } from '../functions/types';
import Die from './Die';
import { useAuth } from '../context/AuthContext';

interface ScoreCardProps {
  player1ScoreHistory: ScoreEntry[];
  player2ScoreHistory: ScoreEntry[];
  player1TotalScore: number;
  player2TotalScore: number;
  currentPlayer: number;
  isTwoPlayer: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  player1ScoreHistory,
  player2ScoreHistory,
  player1TotalScore,
  player2TotalScore,
  currentPlayer,
  isTwoPlayer,
}) => {
  const { userDetails } = useAuth();
  const scoreHistory = currentPlayer === 1 ? player1ScoreHistory : player2ScoreHistory;
  const totalScore = currentPlayer === 1 ? player1TotalScore : player2TotalScore;
  const pdfDivId = currentPlayer === 1 ? 'pdf-div-player1' : 'pdf-div-player2';

  return (
    <div id={pdfDivId} className="w-full">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th colSpan={4} className="py-2 px-2 border-b border-gray-200 text-center text-sm md:text-base">
              {isTwoPlayer ? `Player ${currentPlayer}` : userDetails?.preferred_username || 'Player 1'}
            </th>
          </tr>
          <tr>
            <th className="py-2 px-2 border-b border-gray-200 text-left text-sm md:text-base">Round</th>
            <th className="py-2 px-2 border-b border-gray-200 text-left text-sm md:text-base">Score</th>
            <th className="py-2 px-2 border-b border-gray-200 text-left text-sm md:text-base">Category</th>
            <th className="py-2 px-2 border-b border-gray-200 text-left text-sm md:text-base">Dice</th>
          </tr>
        </thead>
        <tbody>
          {scoreHistory.map((entry, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-sm md:text-base">{entry.roundScore}</td>
              <td className="py-2 px-4 border-b border-gray-200 text-sm md:text-base">{entry.category}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <div className="flex space-x-1">
                  {entry.dice.map((value, i) => (
                    <Die
                      key={i}
                      value={value}
                      canHold={false}
                      isHeld={true}
                      onToggleHold={() => {}}
                      size="lg"
                      className="h-4 w-4 sm:h-8 sm:w-8"
                      shake={false}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="py-2 px-4 border-t border-gray-200 text-right text-sm md:text-base">Total Score</td>
            <td className="py-2 px-4 border-t border-gray-200 text-sm md:text-base">{totalScore}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ScoreCard;
