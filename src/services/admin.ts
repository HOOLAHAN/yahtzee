import { fetchAuthSession } from "aws-amplify/auth";
import { client } from "../lib/amplifyClient";

export interface DailyAdminActivity {
  date: string;
  games: number;
  players: number;
}
export interface AdminLifecycleEvent {
  gameId: string;
  action: string;
  mode: string;
  round: number;
  score: number;
  categoriesFilled: number;
  platform: string;
  occurredAt: string;
}
export interface AdminRecentGame {
  id: string;
  mode: string;
  score: number;
  completedAt: string;
  yahtzeeCount: number;
  earnedUpperBonus: boolean;
  remoteOutcome?: string | null;
  opponent?: string | null;
}
export interface AdminModeBreakdown {
  mode: string;
  starts: number;
  abandons: number;
  completions: number;
}
export interface AdminUser {
  userId: string;
  email: string;
  emailVerified: boolean;
  username: string;
  firstName: string;
  lastName: string;
  status: string;
  enabled: boolean;
  profileComplete: boolean;
  signedUpAt: string | null;
  accountUpdatedAt: string | null;
  lastPlayedAt: string | null;
  gamesPlayed: number;
  soloGames: number;
  dailyGames: number;
  remoteGames: number;
  remoteWins: number;
  remoteDraws: number;
  remoteLosses: number;
  gameStarts: number;
  abandonedGames: number;
  resetGames: number;
  modeSwitchAbandons: number;
  remoteExits: number;
  averageAbandonRound: number;
  lastAbandonedAt: string | null;
  lifecyclePlatforms: string[];
  lifecycleModeBreakdown: AdminModeBreakdown[];
  recentAbandonments: AdminLifecycleEvent[];
  recentGames: AdminRecentGame[];
  gameHistory: AdminRecentGame[];
  bestScore: number | null;
  averageScore: number | null;
  pushNotificationsEnabled: boolean;
  isAdmin: boolean;
}

export interface AdminNotificationResult {
  audienceCount: number;
  sentCount: number;
  failedCount: number;
}
export interface AdminNotificationHistory {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  audience: "all" | "selected";
  selectedCount: number;
  audienceCount: number;
  sentCount: number;
  failedCount: number;
  requestedBy: string;
}
export interface AdminSubmission {
  id: string;
  userId: string;
  username: string;
  mode: string;
  score: number;
  completedAt: string;
}
export interface AdminEmailHistory {
  id: string;
  userId: string;
  recipient: string;
  username: string;
  campaign: string;
  messageType: string;
  status: string;
  sentAt: string | null;
  deliveredAt: string | null;
  clickedAt: string | null;
  bouncedAt: string | null;
  complaintAt: string | null;
  renderingFailedAt: string | null;
  lastEventType: string | null;
}
export interface AdminDashboardData {
  totalUsers: number;
  completedGames: number;
  soloGames: number;
  dailyGames: number;
  remoteGames: number;
  remoteMatches: number;
  remoteWins: number;
  remoteDraws: number;
  gamesToday: number;
  gamesLast7Days: number;
  gamesLast30Days: number;
  activeUsersLast7Days: number;
  activeUsersLast30Days: number;
  averageScore: number;
  yahtzeesRolled: number;
  upperBonusesEarned: number;
  gameStarts: number;
  abandonedGames: number;
  resetGames: number;
  modeSwitchAbandons: number;
  remoteExits: number;
  staleGames: number;
  gameCompletionRate: number;
  averageAbandonRound: number;
  abandonmentByMode: AdminModeBreakdown[];
  recentAbandonments: AdminLifecycleEvent[];
  generatedAt: string;
  dailyActivity: DailyAdminActivity[];
  users: AdminUser[];
  recentSubmissions: AdminSubmission[];
  notificationHistory: AdminNotificationHistory[];
  emailHistory: AdminEmailHistory[];
}

export async function sendAdminNotification(
  title: string,
  body: string,
  userIds?: string[],
): Promise<AdminNotificationResult> {
  const session = await fetchAuthSession();
  const authToken = session.tokens?.idToken?.toString();
  if (!authToken) throw new Error("Sign in required.");
  const result = await (client as any).graphql({
    query: `mutation SendAdminNotification($title:String!,$body:String!,$userIds:[ID!]){sendAdminNotification(title:$title,body:$body,userIds:$userIds){audienceCount sentCount failedCount}}`,
    variables: { title, body, userIds: userIds?.length ? userIds : null },
    authMode: "userPool",
    authToken,
  });
  if (!result.data?.sendAdminNotification)
    throw new Error(
      result.errors?.[0]?.message || "Unable to send notification.",
    );
  return result.data.sendAdminNotification;
}

function parseJsonArray<T>(value: unknown): T[] {
  let parsed = value;
  for (
    let attempt = 0;
    attempt < 2 && typeof parsed === "string";
    attempt += 1
  ) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed as T[];
}

function parseDashboardActivity(value: unknown): {
  scores: AdminSubmission[];
  notifications: AdminNotificationHistory[];
} {
  let parsed = value;
  for (
    let attempt = 0;
    attempt < 2 && typeof parsed === "string";
    attempt += 1
  ) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return { scores: [], notifications: [] };
    }
  }
  if (Array.isArray(parsed))
    return { scores: parsed as AdminSubmission[], notifications: [] };
  if (parsed && typeof parsed === "object") {
    const payload = parsed as { scores?: unknown; notifications?: unknown };
    return {
      scores: Array.isArray(payload.scores)
        ? (payload.scores as AdminSubmission[])
        : [],
      notifications: Array.isArray(payload.notifications)
        ? (payload.notifications as AdminNotificationHistory[])
        : [],
    };
  }
  return { scores: [], notifications: [] };
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const session = await fetchAuthSession();
    const authToken = session.tokens?.idToken?.toString();
    if (!authToken) throw new Error("Sign in required.");
    const result = await (client as any).graphql({
      query: `query AdminDashboard { adminDashboard { totalUsers completedGames soloGames dailyGames remoteGames remoteMatches remoteWins remoteDraws gamesToday gamesLast7Days gamesLast30Days activeUsersLast7Days activeUsersLast30Days averageScore yahtzeesRolled upperBonusesEarned gameStarts abandonedGames resetGames modeSwitchAbandons remoteExits staleGames gameCompletionRate averageAbandonRound abandonmentByMode recentAbandonments generatedAt dailyActivity users recentSubmissions } adminEmailHistory }`,
      authMode: "userPool",
      authToken,
    });
    if (!result.data?.adminDashboard)
      throw new Error(
        result.errors?.[0]?.message || "Unable to load the admin dashboard.",
      );
    const dashboard = result.data.adminDashboard;
    const activity = parseDashboardActivity(dashboard.recentSubmissions);
    return {
      ...dashboard,
      dailyActivity: parseJsonArray<DailyAdminActivity>(
        dashboard.dailyActivity,
      ),
      users: parseJsonArray<AdminUser>(dashboard.users),
      abandonmentByMode: parseJsonArray<AdminModeBreakdown>(
        dashboard.abandonmentByMode,
      ),
      recentAbandonments: parseJsonArray<AdminLifecycleEvent>(
        dashboard.recentAbandonments,
      ),
      recentSubmissions: activity.scores,
      notificationHistory: activity.notifications,
      emailHistory: parseJsonArray<AdminEmailHistory>(
        result.data.adminEmailHistory,
      ),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const response = error as {
        errors?: Array<{ message?: string }>;
        message?: string;
      };
      const message =
        response.errors
          ?.map((item) => item.message)
          .filter(Boolean)
          .join("\n") || response.message;
      if (message) throw new Error(message);
    }
    throw error instanceof Error
      ? error
      : new Error("Unable to load the admin dashboard.");
  }
}
