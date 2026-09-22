/**
 * Isolated mock cosmic ranks. Not Junior get_leaderboard() (Phase 2B).
 */
import { Icon } from "@/components/ui/Icon";
import { cosmicRanks, getRankProgress } from "@/content/mock/dashboard";
import { mockStudent } from "@/content/mock/student";
import { cn } from "@/lib/utils";

export function CosmicJourney() {
  const { currentIndex, remaining, next } = getRankProgress(mockStudent.totalXp);

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#12182a]/90 p-5 shadow-card">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Cosmic Journey</h2>
          <p className="text-xs text-on-surface-variant">Complete missions, earn XP and unlock new ranks</p>
        </div>
        {next ? (
          <p className="text-xs font-semibold text-cta-gold">
            {remaining.toLocaleString()} XP to {next.name}
          </p>
        ) : null}
      </div>
      <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {cosmicRanks.map((rank, index) => {
          const reached = index <= currentIndex;
          const current = index === currentIndex;
          return (
            <li className="flex flex-col items-center text-center" key={rank.id}>
              <div
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-full border",
                  current && "border-cta-gold bg-cta-gold/15 text-cta-gold shadow-[0_0_20px_rgba(232,184,74,0.22)]",
                  reached && !current && "border-senior-champagne/30 bg-white/8 text-primary-fixed",
                  !reached && "border-white/10 bg-white/5 text-white/35",
                )}
              >
                <Icon name={rank.icon} className="text-2xl" />
              </div>
              <p className={cn("mt-2 text-[11px] font-semibold", current ? "text-cta-gold" : "text-on-surface-variant")}>
                {rank.name}
              </p>
              <p className="text-[10px] text-white/50">{rank.xp.toLocaleString()} XP</p>
              {current ? (
                <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-cta-gold">Current rank</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
