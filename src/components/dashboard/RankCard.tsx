import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getRankProgress } from "@/content/mock/dashboard";
import { mockStudent } from "@/content/mock/student";

export function RankCard() {
  const progress = getRankProgress(mockStudent.totalXp);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1b2a6b] via-[#24357c] to-[#3b1d73] p-5 shadow-card">
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-sky-300/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/10 ring-4 ring-cyan-200/30">
          <Icon className="text-5xl text-cyan-100" name={progress.current.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/80">
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
            indicatorClassName="bg-gradient-to-r from-cyan-300 to-violet-300"
            label="Rank progress"
            value={progress.percent}
          />
        </div>
      </div>
    </section>
  );
}
