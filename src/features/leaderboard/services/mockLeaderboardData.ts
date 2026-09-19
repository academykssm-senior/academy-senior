/**
 * DEV/MOCK Senior League data.
 *
 * Isolated from UI rendering. Replace the `getMockSeniorLeaderboard` path in
 * `leaderboardService.ts` when Supabase period queries are ready.
 *
 * These XP values are Senior period totals — not lifetime XP.
 */

import { mockStudent } from "@/content/mock/student";
import type { LeaderboardEntry, LeaderboardPeriod } from "@/features/leaderboard/types";

/** Public handle used only to match the current mock student. Never shown in UI. */
export const LEADERBOARD_VIEWER_PUBLIC_ID = "dev-viewer";

type SeedEntry = Omit<LeaderboardEntry, "rank">;

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

const MONTHLY_SEEDS: readonly SeedEntry[] = [
  { userId: "farhan-k", displayName: "Farhan K.", avatarUrl: null, xp: 4860, rankChange: 1, lastActivityAt: hoursAgo(0.4) },
  { userId: "mei-ling", displayName: "Mei Ling", avatarUrl: null, xp: 4510, rankChange: 0, lastActivityAt: hoursAgo(1.2) },
  { userId: "zulkifli-h", displayName: "Zulkifli H.", avatarUrl: null, xp: 4290, rankChange: 2, lastActivityAt: hoursAgo(0.8) },
  { userId: "sarah-l", displayName: "Sarah L.", avatarUrl: null, xp: 3980, rankChange: -1, lastActivityAt: hoursAgo(2.1) },
  { userId: "amir-rahman", displayName: "Amir Rahman", avatarUrl: null, xp: 3760, rankChange: 3, lastActivityAt: hoursAgo(1.5) },
  { userId: "nurul-izzah", displayName: "Nurul Izzah", avatarUrl: null, xp: 3590, rankChange: 0, lastActivityAt: hoursAgo(3.2) },
  { userId: "devansh-p", displayName: "Devansh P.", avatarUrl: null, xp: 3410, rankChange: -2, lastActivityAt: hoursAgo(2.6) },
  { userId: "priya-s", displayName: "Priya S.", avatarUrl: null, xp: 3280, rankChange: 1, lastActivityAt: hoursAgo(4.0) },
  { userId: "hafiz-m", displayName: "Hafiz M.", avatarUrl: null, xp: 3120, rankChange: 0, lastActivityAt: hoursAgo(5.5) },
  { userId: "aiman-s", displayName: "Aiman S.", avatarUrl: null, xp: 2980, rankChange: 2, lastActivityAt: hoursAgo(3.8) },
  { userId: "siti-zahra", displayName: "Siti Zahra", avatarUrl: null, xp: 2840, rankChange: -1, lastActivityAt: hoursAgo(6.1) },
  { userId: "daniel-tan", displayName: "Daniel Tan", avatarUrl: null, xp: 2710, rankChange: 0, lastActivityAt: hoursAgo(4.4) },
  { userId: "kavitha-r", displayName: "Kavitha R.", avatarUrl: null, xp: 2580, rankChange: 1, lastActivityAt: hoursAgo(7.0) },
  { userId: "johan-lee", displayName: "Johan Lee", avatarUrl: null, xp: 2410, rankChange: -3, lastActivityAt: hoursAgo(8.2) },
  { userId: "alya-hassan", displayName: "Alya Hassan", avatarUrl: null, xp: 2260, rankChange: 0, lastActivityAt: hoursAgo(5.0) },
  { userId: "wei-jun", displayName: "Wei Jun", avatarUrl: null, xp: 2090, rankChange: 2, lastActivityAt: hoursAgo(9.5) },
  { userId: "hana-yusof", displayName: "Hana Yusof", avatarUrl: null, xp: 1600, rankChange: 1, lastActivityAt: hoursAgo(2.8) },
  {
    userId: LEADERBOARD_VIEWER_PUBLIC_ID,
    displayName: mockStudent.displayName,
    avatarUrl: null,
    xp: 1280,
    rankChange: 3,
    lastActivityAt: hoursAgo(0.2),
  },
  { userId: "iman-f", displayName: "Iman F.", avatarUrl: null, xp: 1140, rankChange: -1, lastActivityAt: hoursAgo(11) },
  { userId: "arif-n", displayName: "Arif N.", avatarUrl: null, xp: 980, rankChange: 0, lastActivityAt: hoursAgo(14) },
  { userId: "liyana-o", displayName: "Liyana O.", avatarUrl: null, xp: 840, rankChange: 2, lastActivityAt: hoursAgo(18) },
  { userId: "adam-z", displayName: "Adam Z.", avatarUrl: null, xp: 720, rankChange: -2, lastActivityAt: hoursAgo(22) },
];

const WEEKLY_SEEDS: readonly SeedEntry[] = [
  { userId: "mei-ling", displayName: "Mei Ling", avatarUrl: null, xp: 980, rankChange: 2, lastActivityAt: hoursAgo(0.6) },
  { userId: "farhan-k", displayName: "Farhan K.", avatarUrl: null, xp: 940, rankChange: -1, lastActivityAt: hoursAgo(1.1) },
  { userId: "sarah-l", displayName: "Sarah L.", avatarUrl: null, xp: 870, rankChange: 1, lastActivityAt: hoursAgo(2.0) },
  { userId: "zulkifli-h", displayName: "Zulkifli H.", avatarUrl: null, xp: 810, rankChange: 0, lastActivityAt: hoursAgo(0.9) },
  { userId: "nurul-izzah", displayName: "Nurul Izzah", avatarUrl: null, xp: 760, rankChange: 3, lastActivityAt: hoursAgo(3.4) },
  { userId: "amir-rahman", displayName: "Amir Rahman", avatarUrl: null, xp: 720, rankChange: -2, lastActivityAt: hoursAgo(1.8) },
  { userId: "priya-s", displayName: "Priya S.", avatarUrl: null, xp: 690, rankChange: 0, lastActivityAt: hoursAgo(4.2) },
  { userId: "devansh-p", displayName: "Devansh P.", avatarUrl: null, xp: 650, rankChange: 1, lastActivityAt: hoursAgo(2.4) },
  { userId: "aiman-s", displayName: "Aiman S.", avatarUrl: null, xp: 610, rankChange: -1, lastActivityAt: hoursAgo(5.1) },
  { userId: "hafiz-m", displayName: "Hafiz M.", avatarUrl: null, xp: 580, rankChange: 0, lastActivityAt: hoursAgo(6.0) },
  { userId: "daniel-tan", displayName: "Daniel Tan", avatarUrl: null, xp: 540, rankChange: 2, lastActivityAt: hoursAgo(3.6) },
  { userId: "siti-zahra", displayName: "Siti Zahra", avatarUrl: null, xp: 510, rankChange: 0, lastActivityAt: hoursAgo(7.3) },
  { userId: "alya-hassan", displayName: "Alya Hassan", avatarUrl: null, xp: 470, rankChange: 1, lastActivityAt: hoursAgo(4.8) },
  { userId: "kavitha-r", displayName: "Kavitha R.", avatarUrl: null, xp: 430, rankChange: -2, lastActivityAt: hoursAgo(8.0) },
  {
    userId: LEADERBOARD_VIEWER_PUBLIC_ID,
    displayName: mockStudent.displayName,
    avatarUrl: null,
    xp: 410,
    rankChange: 4,
    lastActivityAt: hoursAgo(0.3),
  },
  { userId: "johan-lee", displayName: "Johan Lee", avatarUrl: null, xp: 360, rankChange: 0, lastActivityAt: hoursAgo(9.2) },
  { userId: "wei-jun", displayName: "Wei Jun", avatarUrl: null, xp: 330, rankChange: 1, lastActivityAt: hoursAgo(10) },
  { userId: "hana-yusof", displayName: "Hana Yusof", avatarUrl: null, xp: 290, rankChange: -1, lastActivityAt: hoursAgo(2.9) },
  { userId: "iman-f", displayName: "Iman F.", avatarUrl: null, xp: 250, rankChange: 0, lastActivityAt: hoursAgo(12) },
  { userId: "arif-n", displayName: "Arif N.", avatarUrl: null, xp: 210, rankChange: 2, lastActivityAt: hoursAgo(15) },
  { userId: "liyana-o", displayName: "Liyana O.", avatarUrl: null, xp: 180, rankChange: 0, lastActivityAt: hoursAgo(19) },
  { userId: "adam-z", displayName: "Adam Z.", avatarUrl: null, xp: 140, rankChange: -1, lastActivityAt: hoursAgo(21) },
];

export function getMockLeaderboardSeeds(period: LeaderboardPeriod): readonly SeedEntry[] {
  return period === "weekly" ? WEEKLY_SEEDS : MONTHLY_SEEDS;
}
