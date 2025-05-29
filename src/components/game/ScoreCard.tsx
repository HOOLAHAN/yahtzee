// ScoreCard.tsx

import React from 'react';
import { ScoreEntry } from '../../lib/types';
import Die from './Die';
import { useAuth } from '../../context/AuthContext';

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
  const totalScore = scoreHistory.reduce((sum, entry) => sum + entry.roundScore, 0);
  const pdfDivId = currentPlayer === 1 ? 'pdf-div-player1' : 'pdf-div-player2';

  const textColorClass = currentPlayer === 2 ? 'text-electricPink' : 'text-neonCyan';

  return (
    <div id={pdfDivId} className="w-full max-w-4xl mx-auto overflow-x-auto">
      <table className={`min-w-full bg-deepBlack ${textColorClass} shadow-lg overflow-hidden rounded-md`}>
        <thead className="bg-deepBlack">
          <tr>
            <th
              colSpan={4}
              className={`py-3 px-4 border-b border-gray-600 text-center text-lg font-semibold rounded-t-md ${textColorClass}`}
            >
              {isTwoPlayer ? `Player ${currentPlayer}` : userDetails?.preferred_username || 'Player 1'}
            </th>
          </tr>
          <tr>
            <th className="py-2 px-3 border-b border-gray-700 text-left text-sm md:text-base">Round</th>
            <th className="py-2 px-3 border-b border-gray-700 text-left text-sm md:text-base">Score</th>
            <th className="py-2 px-3 border-b border-gray-700 text-left text-sm md:text-base">Category</th>
            <th className="py-2 px-3 border-b border-gray-700 text-left text-sm md:text-base">Dice</th>
          </tr>
        </thead>
        <tbody>
          {scoreHistory.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-800 transition-colors">
              <td className="py-2 px-3 border-b border-gray-700 text-sm text-left">{index + 1}</td>
              <td className="py-2 px-3 border-b border-gray-700 text-sm">{entry.roundScore}</td>
              <td className="py-2 px-3 border-b border-gray-700 text-sm">{entry.category}</td>
              <td className="py-2 px-3 border-b border-gray-700">
                <div className="flex flex-wrap gap-1">
                  {entry.dice.map((value, i) => (
                    <Die
                      key={i}
                      value={value}
                      canHold={false}
                      isHeld={true}
                      onToggleHold={() => {}}
                      size="lg"
                      className="h-6 w-6 sm:h-8 sm:w-8"
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
            <td
              colSpan={3}
              className="py-3 px-3 border-t border-gray-600 text-right font-semibold text-sm md:text-base"
            >
              Total Score
            </td>
            <td
              className="py-3 px-3 border-t border-gray-600 font-semibold text-sm md:text-base"
            >
              {totalScore}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ScoreCard;
