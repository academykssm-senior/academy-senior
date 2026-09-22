import { useState } from "react";
import { CurrentStudentRank } from "@/features/leaderboard/components/CurrentStudentRank";
import {
  LeaderboardEmptyState,
  LeaderboardErrorState,
  LeaderboardHeader,
  LeaderboardSkeleton,
} from "@/features/leaderboard/components/LeaderboardHeader";
import { LeaderboardPodium } from "@/features/leaderboard/components/LeaderboardPodium";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";
import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import { LEADERBOARD_VIEWER_PUBLIC_ID } from "@/features/leaderboard/services/mockLeaderboardData";
import type { LeaderboardPeriod } from "@/features/leaderboard/types";
import { StudyChatPanel } from "@/features/study-chat/components/StudyChatPanel";
import { getRouteApi } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type MobilePane = "leaderboard" | "chat";

export function LeaderboardPage() {
  const { student } = getRouteApi("/_app").useRouteContext();
  const [period, setPeriod] = useState<LeaderboardPeriod>("monthly");
  const [mobilePane, setMobilePane] = useState<MobilePane>("leaderboard");
  const [retryKey, setRetryKey] = useState(0);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(17rem,28%)] lg:items-start lg:gap-6">
      <div className="lg:hidden">
        <MobilePaneTabs onChange={setMobilePane} value={mobilePane} />
      </div>

      <div className={cn(mobilePane !== "leaderboard" && "max-lg:hidden")}>
        <LeaderboardHeader onPeriodChange={setPeriod} period={period} />
        <LeaderboardResults
          key={`${period}-${retryKey}`}
          lang={student.languagePreference}
          onRetry={() => setRetryKey((value) => value + 1)}
          period={period}
        />
      </div>

      <StudyChatPanel
        className={cn(
          "max-lg:h-[calc(100dvh-14.75rem)] lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)]",
          mobilePane !== "chat" && "max-lg:hidden",
        )}
        displayName={student.displayName}
        userId={LEADERBOARD_VIEWER_PUBLIC_ID}
      />
    </div>
  );
}

function LeaderboardResults({
  period,
  lang,
  onRetry,
}: {
  period: LeaderboardPeriod;
  lang: "bm" | "en";
  onRetry: () => void;
}) {
  const view = useLeaderboard(period, LEADERBOARD_VIEWER_PUBLIC_ID);

  return (
    <div className="mt-6 space-y-4">
      {view.status === "loading" ? <LeaderboardSkeleton /> : null}
      {view.status === "error" ? (
        <LeaderboardErrorState message={view.message} onRetry={onRetry} />
      ) : null}
      {view.status === "empty" ? (
        <LeaderboardEmptyState lang={lang} />
      ) : null}
      {view.status === "ready" ? (
        <>
          <LeaderboardPodium entries={view.snapshot.entries} />
          <CurrentStudentRank period={period} standing={view.snapshot.currentStudent} />
          <LeaderboardTable
            currentUserId={view.snapshot.currentStudent?.userId ?? null}
            entries={view.snapshot.entries}
          />
        </>
      ) : null}
    </div>
  );
}

function MobilePaneTabs({
  value,
  onChange,
}: {
  value: MobilePane;
  onChange: (pane: MobilePane) => void;
}) {
  return (
    <div
      aria-label="Leaderboard sections"
      className="mb-4 inline-flex rounded-xl bg-white/5 p-1"
      role="tablist"
    >
      <PaneTab onSelect={() => onChange("leaderboard")} selected={value === "leaderboard"}>
        Leaderboard
      </PaneTab>
      <PaneTab onSelect={() => onChange("chat")} selected={value === "chat"}>
        Study Chat
      </PaneTab>
    </div>
  );
}

function PaneTab({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      aria-selected={selected}
      className={cn(
        "min-h-10 rounded-lg px-3 text-sm font-semibold",
        selected ? "bg-cta-gold/15 text-cta-gold" : "text-on-surface-variant",
      )}
      onClick={onSelect}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}
