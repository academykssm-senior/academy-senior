/**
 * Isolated mock XP / rank UI. Not Senior-scoped progress (Phase 2B).
 */
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getRankProgress } from "@/content/mock/dashboard";
import { mockStudent } from "@/content/mock/student";

export function RankCard() {
  const progress = getRankProgress(mockStudent.totalXp);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#101628] via-[#141c32] to-[#1a2438] p-5 shadow-card">
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-cta-gold/12 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/8 ring-4 ring-cta-gold/25">
          <Icon className="text-5xl text-cta-gold" name={progress.current.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cta-gold/80">
              Current rank
            </p>
            <span className="text-[10px] text-white/60">How to earn XP?</span>
          </div>
          <h2 className="mt-1 truncate text-2xl font-bold text-white">{progress.current.name}</h2>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            {mockStudent.totalXp.toLocaleString()} XP
          </p>
          {progress.next ? (
            <p className="mt-1 text-xs text-white/70">
              {progress.remaining.toLocaleString()} XP until {progress.next.name}
            </p>
          ) : null}
          <ProgressBar
            className="mt-3 h-2 bg-white/15"
            indicatorClassName="bg-gradient-to-r from-cta-gold to-amber-200"
            label="Rank progress"
            value={progress.percent}
          />
        </div>
      </div>
    </section>
  );
}
