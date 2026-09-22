import { StudentAvatar } from "@/components/ui/StudentAvatar";
import {
  formatPaddedRank,
  formatRank,
  formatRankChange,
  formatRelativeActivity,
  formatXp,
} from "@/features/leaderboard/lib/format";
import type { LeaderboardEntry } from "@/features/leaderboard/types";
import { cn } from "@/lib/utils";

type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  isCurrentStudent: boolean;
  variant: "table" | "compact";
};

export function LeaderboardRow({ entry, isCurrentStudent, variant }: LeaderboardRowProps) {
  const change = formatRankChange(entry.rankChange);
  const changeClass =
    change.tone === "up"
      ? "text-status-mastered"
      : change.tone === "down"
        ? "text-status-review"
        : "text-on-surface-variant";

  if (variant === "compact") {
    return (
      <li
        className={cn(
          "flex items-center gap-3 border-t border-white/8 px-3 py-3 first:border-t-0",
          isCurrentStudent && "bg-cta-gold/8",
        )}
      >
        <span className="w-8 shrink-0 font-display text-sm font-semibold tabular-nums text-on-surface-variant">
          {formatRank(entry.rank)}
        </span>
        <StudentAvatar name={entry.displayName} size="sm" src={entry.avatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {entry.displayName}
            {isCurrentStudent ? (
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-cta-gold">
                You
              </span>
            ) : null}
          </p>
          <p className="text-xs font-semibold tabular-nums text-cta-gold">{formatXp(entry.xp)}</p>
        </div>
        <span className={cn("shrink-0 text-sm font-semibold tabular-nums", changeClass)}>
          {change.label}
        </span>
      </li>
    );
  }

  return (
    <tr className={cn(isCurrentStudent && "bg-cta-gold/8")}>
      <th
        className="border-t border-white/8 px-4 py-3.5 text-left font-display text-sm font-semibold tabular-nums text-on-surface-variant"
        scope="row"
      >
        {formatPaddedRank(entry.rank)}
      </th>
      <td className="border-t border-white/8 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <StudentAvatar name={entry.displayName} size="sm" src={entry.avatarUrl} />
          <span className="font-medium text-white">
            {entry.displayName}
            {isCurrentStudent ? (
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-cta-gold">
                You
              </span>
            ) : null}
          </span>
        </div>
      </td>
      <td className="border-t border-white/8 px-4 py-3.5 text-sm font-semibold tabular-nums text-cta-gold">
        {formatXp(entry.xp)}
      </td>
      <td className={cn("border-t border-white/8 px-4 py-3.5 text-sm font-semibold tabular-nums", changeClass)}>
        {change.label}
      </td>
      <td className="border-t border-white/8 px-4 py-3.5 text-sm text-on-surface-variant">
        {formatRelativeActivity(entry.lastActivityAt)}
      </td>
    </tr>
  );
}

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
};

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const ranked = entries.filter((entry) => entry.rank > 3);

  if (ranked.length === 0) return null;

  return (
    <section aria-label="Ranked standings">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-white">Standings</h2>
        <p className="text-xs text-on-surface-variant">Senior League</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-surface-card">
        <table className="hidden w-full border-collapse text-left lg:table">
          <caption className="sr-only">Senior League ranked standings</caption>
          <thead className="text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
            <tr>
              <th className="px-4 py-3" scope="col">Rank</th>
              <th className="px-4 py-3" scope="col">Student</th>
              <th className="px-4 py-3" scope="col">XP</th>
              <th className="px-4 py-3" scope="col">Change</th>
              <th className="px-4 py-3" scope="col">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((entry) => (
              <LeaderboardRow
                entry={entry}
                isCurrentStudent={entry.userId === currentUserId}
                key={entry.userId}
                variant="table"
              />
            ))}
          </tbody>
        </table>

        <ol className="lg:hidden">
          {ranked.map((entry) => (
            <LeaderboardRow
              entry={entry}
              isCurrentStudent={entry.userId === currentUserId}
              key={`mobile-${entry.userId}`}
              variant="compact"
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
