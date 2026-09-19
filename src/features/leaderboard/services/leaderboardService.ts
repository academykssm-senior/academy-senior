/**
 * Senior League leaderboard service.
 *
 * Current implementation: isolated mock/dev data.
 * Future implementation: query Senior XP events for the selected period:
 *
 *   source_app = 'senior'
 *   created_at within [period_start, period_end)
 *   grouped by user, ordered by SUM(xp) desc
 *
 * Do not compute this board from lifetime XP or Junior frontend data.
 */

import {
  getMockLeaderboardSeeds,
} from "@/features/leaderboard/services/mockLeaderboardData";
import type {
  CurrentStudentStanding,
  LeaderboardEntry,
  LeaderboardQuery,
  LeaderboardSnapshot,
} from "@/features/leaderboard/types";

const MOCK_LOAD_DELAY_MS = 220;

export async function getSeniorLeaderboard(
  query: LeaderboardQuery,
): Promise<LeaderboardSnapshot> {
  await delay(MOCK_LOAD_DELAY_MS);

  const league = query.league ?? "senior";
  const seeds = getMockLeaderboardSeeds(query.period);
  const entries = rankEntries([...seeds]);
  const currentStudent = resolveCurrentStudent(entries, query.viewerPublicId);

  return {
    league,
    period: query.period,
    sourceApp: "senior",
    generatedAt: new Date().toISOString(),
    entries,
    currentStudent,
  };
}

function rankEntries(seeds: Array<Omit<LeaderboardEntry, "rank">>): LeaderboardEntry[] {
  return seeds
    .slice()
    .sort((a, b) => b.xp - a.xp || a.displayName.localeCompare(b.displayName))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function resolveCurrentStudent(
  entries: LeaderboardEntry[],
  viewerPublicId: string,
): CurrentStudentStanding | null {
  const current = entries.find((entry) => entry.userId === viewerPublicId);
  if (!current) return null;

  const nextRank = current.rank > 1 ? current.rank - 1 : null;
  const ahead = nextRank === null ? undefined : entries.find((entry) => entry.rank === nextRank);
  const xpToNextRank =
    ahead === undefined ? null : Math.max(0, ahead.xp - current.xp);

  return {
    userId: current.userId,
    displayName: current.displayName,
    rank: current.rank,
    xp: current.xp,
    xpToNextRank,
    nextRank,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
