import { fetchAuthSession } from 'aws-amplify/auth';
import { client } from '../lib/amplifyClient';
import { ScoreEntry } from '../lib/types';

export type ResultMode = 'SOLO' | 'DAILY';
export interface GameResult {
  id: string; userId: string; username: string; mode: ResultMode; modeDate: string;
  challengeDate?: string; score: number; completedAt: string; yahtzeeCount: number;
  earnedUpperBonus: boolean; completedSmallStraight: boolean;
  completedLargeStraight: boolean; noZeroScores: boolean; yahtzeeOnFinalRoll: boolean;
  scorecard?: string;
}
export interface DailyRoundStanding {
  challengeDate: string; round: number; score: number; rank: number;
  playerCount: number; percentile: number;
}
const fields = 'id userId username mode modeDate challengeDate score completedAt yahtzeeCount earnedUpperBonus completedSmallStraight completedLargeStraight noZeroScores yahtzeeOnFinalRoll scorecard';

export const resultMetrics = (entries: ScoreEntry[]) => {
  const upper = new Set(['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes']);
  const subtotal = entries.filter((entry) => upper.has(entry.category)).reduce((sum, entry) => sum + entry.roundScore, 0);
  return {
    score: entries.reduce((sum, entry) => sum + entry.roundScore, 0) + (subtotal >= 63 ? 35 : 0),
    yahtzeeCount: entries.filter((entry) => entry.category === 'Yahtzee' && entry.roundScore === 50).length,
    earnedUpperBonus: subtotal >= 63,
    completedSmallStraight: entries.some((entry) => entry.category === 'SmallStraight' && entry.roundScore === 30),
    completedLargeStraight: entries.some((entry) => entry.category === 'LargeStraight' && entry.roundScore === 40),
    noZeroScores: entries.length === 13 && entries.every((entry) => entry.roundScore > 0),
    scorecard: JSON.stringify(Object.fromEntries(entries.map((entry) => [entry.category, entry.roundScore]))),
  };
};

export async function createGameResult(input: Omit<GameResult, 'userId' | 'username'>) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken;
  if (!token) throw new Error('Sign in to save progress and join the leaderboard.');
  const { modeDate: _modeDate, completedAt: _completedAt, challengeDate, ...metrics } = input;
  const result = await (client as any).graphql({ query: `mutation SubmitGameResult($input:SubmitGameResultInput!){submitGameResult(input:$input){${fields}}}`, authMode: 'userPool', authToken: token.toString(), variables: { input: { ...metrics, challengeDate } } });
  if (!result.data?.submitGameResult) throw new Error(result.errors?.map((error: { message: string }) => error.message).join(', ') || 'Unable to save game progress.');
  return result.data.submitGameResult as GameResult;
}

export async function submitDailyRoundProgress(challengeDate: string, round: number, score: number): Promise<DailyRoundStanding> {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken;
  if (!token) throw new Error('Sign in to compare your Daily Challenge position.');
  const result = await (client as any).graphql({
    query: `mutation DailyRoundProgress($challengeDate:AWSDate!,$round:Int!,$score:Int!){submitDailyRoundProgress(challengeDate:$challengeDate,round:$round,score:$score){challengeDate round score rank playerCount percentile}}`,
    authMode: 'userPool',
    authToken: token.toString(),
    variables: { challengeDate, round, score },
  });
  if (!result.data?.submitDailyRoundProgress) throw new Error(result.errors?.map((error: { message: string }) => error.message).join(', ') || 'Unable to calculate your Daily Challenge position.');
  return result.data.submitDailyRoundProgress as DailyRoundStanding;
}

export async function fetchDailyResults(dateKey: string): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query Daily($modeDate:String!){gameResultsByModeDate(modeDate:$modeDate,sortDirection:DESC,limit:100){items{${fields}}}}`, authMode: 'apiKey', variables: { modeDate: `DAILY#${dateKey}` } });
  return (result.data?.gameResultsByModeDate?.items ?? []).filter(Boolean);
}

export async function fetchSoloResults(limit = 500): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query Solo($modeDate:String!,$limit:Int){gameResultsByModeDate(modeDate:$modeDate,sortDirection:DESC,limit:$limit){items{${fields}}}}`, authMode: 'apiKey', variables: { modeDate: 'SOLO#ALL', limit } });
  return (result.data?.gameResultsByModeDate?.items ?? []).filter(Boolean);
}

export async function fetchAllDailyResults(limit = 500): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query AllDaily($limit:Int){listGameResults(filter:{mode:{eq:DAILY}},limit:$limit){items{${fields}}}}`, authMode: 'apiKey', variables: { limit } });
  return (result.data?.listGameResults?.items ?? []).filter(Boolean).sort((a: GameResult, b: GameResult) => b.score - a.score);
}

export async function fetchMyGameResults(userId: string): Promise<GameResult[]> {
  const result = await (client as any).graphql({ query: `query Progress($userId:String!){gameResultsByUser(userId:$userId,sortDirection:DESC,limit:500){items{${fields}}}}`, authMode: 'apiKey', variables: { userId } });
  return (result.data?.gameResultsByUser?.items ?? []).filter(Boolean);
}

export const utcWeekDateKeys = (date = new Date()) => {
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = monday.getUTCDay() || 7; monday.setUTCDate(monday.getUTCDate() - day + 1);
  return Array.from({ length: 7 }, (_, offset) => { const value = new Date(monday); value.setUTCDate(monday.getUTCDate() + offset); return value.toISOString().slice(0, 10); });
};

export async function fetchWeeklyResults(date = new Date()) {
  const keys = utcWeekDateKeys(date);
  const results = (await Promise.all(keys.map(fetchDailyResults))).flat();
  const players = new Map<string, { username: string; scores: number[] }>();
  results.forEach((result) => { const player = players.get(result.userId) ?? { username: result.username, scores: [] }; player.username = result.username; player.scores.push(result.score); players.set(result.userId, player); });
  return Array.from(players.entries()).map(([userId, player]) => ({ id: `week:${keys[0]}:${userId}`, userId, username: player.username, score: player.scores.sort((a, b) => b - a).slice(0, 5).reduce((sum, score) => sum + score, 0) })).sort((a, b) => b.score - a.score);
}
