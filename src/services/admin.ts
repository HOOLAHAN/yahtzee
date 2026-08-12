import { fetchAuthSession } from 'aws-amplify/auth';
import { client } from '../lib/amplifyClient';

export interface DailyAdminActivity { date: string; games: number; players: number }
export interface AdminDashboardData {
  totalUsers: number;
  completedGames: number;
  soloGames: number;
  dailyGames: number;
  gamesToday: number;
  gamesLast7Days: number;
  gamesLast30Days: number;
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  averageScore: number;
  yahtzeesRolled: number;
  upperBonusesEarned: number;
  generatedAt: string;
  dailyActivity: DailyAdminActivity[];
}

function parseDailyActivity(value: unknown): DailyAdminActivity[] {
  let parsed = value;
  for (let attempt = 0; attempt < 2 && typeof parsed === 'string'; attempt += 1) {
    try { parsed = JSON.parse(parsed); } catch { return []; }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((day): day is DailyAdminActivity => (
    typeof day === 'object' && day !== null &&
    typeof (day as DailyAdminActivity).date === 'string' &&
    typeof (day as DailyAdminActivity).games === 'number' &&
    typeof (day as DailyAdminActivity).players === 'number'
  ));
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const session = await fetchAuthSession();
    const authToken = session.tokens?.idToken?.toString();
    if (!authToken) throw new Error('Sign in required.');
    const result = await (client as any).graphql({
      query: `query AdminDashboard { adminDashboard { totalUsers completedGames soloGames dailyGames gamesToday gamesLast7Days gamesLast30Days activeUsersLast7Days activeUsersLast30Days averageScore yahtzeesRolled upperBonusesEarned generatedAt dailyActivity } }`,
      authMode: 'userPool', authToken,
    });
    if (!result.data?.adminDashboard) throw new Error(result.errors?.[0]?.message || 'Unable to load the admin dashboard.');
    const dashboard = result.data.adminDashboard;
    return { ...dashboard, dailyActivity: parseDailyActivity(dashboard.dailyActivity) };
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const response = error as { errors?: Array<{ message?: string }>; message?: string };
      const message = response.errors?.map((item) => item.message).filter(Boolean).join('\n') || response.message;
      if (message) throw new Error(message);
    }
    throw error instanceof Error ? error : new Error('Unable to load the admin dashboard.');
  }
}
