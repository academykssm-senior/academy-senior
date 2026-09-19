import { StudentAvatar } from "@/components/ui/StudentAvatar";
import { formatRank, formatXp } from "@/features/leaderboard/lib/format";
import type { CurrentStudentStanding, LeaderboardPeriod } from "@/features/leaderboard/types";

type CurrentStudentRankProps = {
  standing: CurrentStudentStanding | null;
  period: LeaderboardPeriod;
};

export function CurrentStudentRank({ standing, period }: CurrentStudentRankProps) {
  const periodLabel = period === "weekly" ? "this week" : "this month";

  return (
    <section
      aria-label="Your position"
      className="rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4 sm:px-5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
        Your position
      </p>
      {standing ? (
        <div className="mt-3 flex items-center gap-3">
          <StudentAvatar name={standing.displayName} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display text-2xl font-bold tabular-nums text-cyan-300">
                {formatRank(standing.rank)}
              </p>
              <p className="truncate text-base font-semibold text-white">{standing.displayName}</p>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              <span className="font-semibold text-cyan-200">{formatXp(standing.xp)}</span>
              {` ${periodLabel}`}
            </p>
            {standing.nextRank !== null && standing.xpToNextRank !== null ? (
              <p className="mt-1 text-xs text-on-surface-variant">
                {formatXp(standing.xpToNextRank)} to reach {formatRank(standing.nextRank)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-on-surface-variant">You are at the top of the Senior League.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-on-surface-variant">
          Complete Senior learning activities to appear on this board.
        </p>
      )}
    </section>
  );
}
