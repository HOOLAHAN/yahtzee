// ScoreCard.tsx

import React from 'react';
import { ScoreEntry } from '../../lib/types';
import DiceFace from './DiceFace';
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
  const upperCategorySet = new Set(['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes']);
  const upperSubtotal = scoreHistory.filter((entry) => upperCategorySet.has(entry.category)).reduce((sum, entry) => sum + entry.roundScore, 0);
  const pdfDivId = currentPlayer === 1 ? 'pdf-div-player1' : 'pdf-div-player2';

  const textColorClass = currentPlayer === 2 ? 'web-player-two-text' : 'text-neonCyan';
  const scoreRows = (entries: ScoreEntry[]) => entries.map((entry) => {
    const round = scoreHistory.indexOf(entry) + 1;
    return <tr key={`${entry.category}-${round}`} className="hover:bg-gray-800 transition-colors"><td className="py-2 px-3 border-b border-gray-700 text-sm text-left">{round}</td><td className="py-2 px-3 border-b border-gray-700 text-sm">{entry.roundScore}</td><td className="py-2 px-3 border-b border-gray-700 text-sm">{entry.category}</td><td className="py-2 px-3 border-b border-gray-700"><div className="flex flex-wrap gap-1">{entry.dice.map((value, index) => <DiceFace key={index} value={value} canHold={false} isHeld onToggleHold={() => {}} size="lg" className="h-6 w-6 sm:h-8 sm:w-8" shake={false} />)}</div></td></tr>;
  });

  return (
    <div id={pdfDivId} className="w-full max-w-4xl mx-auto overflow-x-auto">
      <section className="web-scorecard-bonus"><div><strong>Upper bonus progress</strong><span>{upperSubtotal >= 63 ? 'Bonus achieved · +35' : `${63 - upperSubtotal} points to go`}</span></div><div className="web-bonus-progress" role="progressbar" aria-label="Upper bonus progress" aria-valuemin={0} aria-valuemax={63} aria-valuenow={Math.min(upperSubtotal, 63)}><i style={{ width: `${Math.min(100, upperSubtotal / 63 * 100)}%` }} /></div><small>{upperSubtotal} / 63</small></section>
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
        <tbody className="web-scorecard-upper"><tr className="scorecard-section-row"><th colSpan={4}>↗ Upper section</th></tr>{scoreRows(scoreHistory.filter((entry) => upperCategorySet.has(entry.category)))}</tbody>
        <tbody className="web-scorecard-lower"><tr className="scorecard-section-row"><th colSpan={4}>ϟ Lower section</th></tr>{scoreRows(scoreHistory.filter((entry) => !upperCategorySet.has(entry.category)))}</tbody>
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
