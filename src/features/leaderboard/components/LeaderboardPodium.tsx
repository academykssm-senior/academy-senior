import { Icon } from "@/components/ui/Icon";
import { StudentAvatar } from "@/components/ui/StudentAvatar";
import { formatXp } from "@/features/leaderboard/lib/format";
import type { LeaderboardEntry } from "@/features/leaderboard/types";
import { cn } from "@/lib/utils";

type PodiumPlace = 1 | 2 | 3;

const PLACE_STYLES: Record<
  PodiumPlace,
  { label: string; ring: string; surface: string; xp: string; glow: string }
> = {
  1: {
    label: "1st",
    ring: "ring-amber-300/55",
    surface: "border-amber-300/25 bg-amber-300/8",
    xp: "text-cyan-300",
    glow: "shadow-[0_0_28px_rgb(251_191_36_/_12%)]",
  },
  2: {
    label: "2nd",
    ring: "ring-slate-200/35",
    surface: "border-white/10 bg-white/4",
    xp: "text-cyan-200",
    glow: "",
  },
  3: {
    label: "3rd",
    ring: "ring-orange-400/40",
    surface: "border-orange-400/20 bg-orange-400/6",
    xp: "text-cyan-200",
    glow: "",
  },
};

type PodiumStudentProps = {
  entry: LeaderboardEntry;
  place: PodiumPlace;
};

export function PodiumStudent({ entry, place }: PodiumStudentProps) {
  const style = PLACE_STYLES[place];
  const isFirst = place === 1;

  return (
    <article
      className={cn(
        "flex h-full flex-col items-center rounded-2xl border px-4 py-5 text-center",
        style.surface,
        style.glow,
        isFirst && "md:-translate-y-4 md:py-7",
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
        {style.label}
      </p>
      <div className="relative mt-3">
        {isFirst ? (
          <Icon
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-base text-amber-300"
            filled
            name="crown"
          />
        ) : null}
        <StudentAvatar
          className={cn("ring-2 ring-offset-2 ring-offset-[#10131b]", style.ring)}
          name={entry.displayName}
          size={isFirst ? "lg" : "md"}
          src={entry.avatarUrl}
        />
      </div>
      <h3 className={cn("mt-3 font-semibold text-white", isFirst ? "text-base" : "text-sm")}>
        {entry.displayName}
      </h3>
      <p className={cn("mt-1 font-bold tabular-nums", isFirst ? "text-xl" : "text-lg", style.xp)}>
        {formatXp(entry.xp)}
      </p>
    </article>
  );
}

type LeaderboardPodiumProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  const first = entries[0];
  const second = entries[1];
  const third = entries[2];

  if (!first && !second && !third) return null;

  return (
    <section
      aria-label="Top three"
      className="grid grid-cols-2 items-end gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      {first ? (
        <div className="col-span-2 md:col-span-1 md:order-2">
          <PodiumStudent entry={first} place={1} />
        </div>
      ) : null}
      {second ? (
        <div className="md:order-1">
          <PodiumStudent entry={second} place={2} />
        </div>
      ) : null}
      {third ? (
        <div className="md:order-3">
          <PodiumStudent entry={third} place={3} />
        </div>
      ) : null}
    </section>
  );
}
