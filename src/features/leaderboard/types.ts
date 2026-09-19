/**
 * Senior League leaderboard contracts.
 *
 * XP architecture (do not collapse these):
 *
 * - Lifetime XP (`StudentProfile.totalXp`) is Junior + Senior combined.
 *   It feeds student rank, Nova growth, and overall XP — not this board.
 * - Senior leaderboard XP (`LeaderboardEntry.xp`) is XP earned from Senior
 *   learning activities during the selected period, conceptually:
 *   `source_app = "senior"` + period window.
 *
 * V1 is a single Senior League. Form 4 / Form 5 can later become filters on
 * this same contract — not separate page implementations.
 */

export const LEADERBOARD_PERIODS = ["monthly", "weekly"] as const;

export type LeaderboardPeriod = (typeof LEADERBOARD_PERIODS)[number];

export type LeaderboardLeagueId = "senior";

export type LeaderboardSourceApp = "senior";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  rankChange: number;
  lastActivityAt: string;
};

export type CurrentStudentStanding = {
  userId: string;
  displayName: string;
  rank: number;
  xp: number;
  xpToNextRank: number | null;
  nextRank: number | null;
};

export type LeaderboardSnapshot = {
  league: LeaderboardLeagueId;
  period: LeaderboardPeriod;
  sourceApp: LeaderboardSourceApp;
  generatedAt: string;
  entries: LeaderboardEntry[];
  currentStudent: CurrentStudentStanding | null;
};

export type LeaderboardQuery = {
  period: LeaderboardPeriod;
  viewerPublicId: string;
  league?: LeaderboardLeagueId;
};
