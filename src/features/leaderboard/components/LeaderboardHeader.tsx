import { Link } from "@tanstack/react-router";
import { LEADERBOARD_PERIODS } from "@/features/leaderboard/types";
import type { LeaderboardPeriod } from "@/features/leaderboard/types";
import type { ContentLanguage } from "@/types/curriculum";
import { cn } from "@/lib/utils";

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
};

type LeaderboardPeriodSelectorProps = {
  value: LeaderboardPeriod;
  onChange: (period: LeaderboardPeriod) => void;
};

export function LeaderboardPeriodSelector({
  value,
  onChange,
}: LeaderboardPeriodSelectorProps) {
  return (
    <div
      aria-label="Leaderboard period"
      className="inline-flex rounded-xl bg-white/5 p-1"
      role="radiogroup"
    >
      {LEADERBOARD_PERIODS.map((period) => {
        const selected = period === value;
        return (
          <button
            aria-checked={selected}
            className={cn(
              "min-h-9 rounded-lg px-3 text-xs font-semibold transition",
              selected
                ? "bg-cta-gold/15 text-cta-gold"
                : "text-on-surface-variant hover:text-white",
            )}
            key={period}
            onClick={() => onChange(period)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const index = LEADERBOARD_PERIODS.indexOf(value);
              const delta = event.key === "ArrowRight" ? 1 : -1;
              const nextIndex =
                (index + delta + LEADERBOARD_PERIODS.length) % LEADERBOARD_PERIODS.length;
              const next = LEADERBOARD_PERIODS[nextIndex];
              if (next) onChange(next);
            }}
            role="radio"
            type="button"
          >
            {PERIOD_LABELS[period]}
          </button>
        );
      })}
    </div>
  );
}

type LeaderboardHeaderProps = {
  period: LeaderboardPeriod;
  onPeriodChange: (period: LeaderboardPeriod) => void;
};

export function LeaderboardHeader({ period, onPeriodChange }: LeaderboardHeaderProps) {
  const periodCopy = period === "weekly" ? "this week" : "this month";

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Senior League
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
          Leaderboard
        </h1>
        <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
          See how your learning progress compares {periodCopy}.
        </p>
      </div>
      <LeaderboardPeriodSelector onChange={onPeriodChange} value={period} />
    </header>
  );
}

export function LeaderboardEmptyState({ lang }: { lang: ContentLanguage }) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface-card px-5 py-8">
      <p className="font-display text-lg font-semibold text-white">
        Your Senior League is warming up.
      </p>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">
        Complete learning activities to start earning XP.
      </p>
      <Link
        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-cta-gold px-5 text-sm font-semibold text-cta-gold-on"
        params={{ lang }}
        to="/f4/$lang"
      >
        Start learning
      </Link>
    </section>
  );
}

export function LeaderboardErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-2xl border border-white/8 bg-surface-card px-5 py-8">
      <p className="font-display text-lg font-semibold text-white">
        Couldn’t load the leaderboard
      </p>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">{message}</p>
      <button
        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </section>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4" role="status">
      <span className="sr-only">Loading Senior League</span>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-36 animate-pulse rounded-2xl bg-white/5 md:order-2 md:h-44" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/5 md:order-1" />
        <div className="h-28 animate-pulse rounded-2xl bg-white/5 md:order-3" />
      </div>
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="h-14 animate-pulse rounded-xl bg-white/5" key={index} />
        ))}
      </div>
    </div>
  );
}

