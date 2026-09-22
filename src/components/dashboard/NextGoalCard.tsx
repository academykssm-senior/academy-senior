/**
 * Isolated mock rank-goal XP. Not Senior curriculum progress (Phase 2B).
 */
import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { getRankProgress } from "@/content/mock/dashboard";
import { mockStudent } from "@/content/mock/student";
import type { LanguageStream } from "@/types/curriculum";

export function NextGoalCard({ lang }: { lang: LanguageStream }) {
  const progress = getRankProgress(mockStudent.totalXp);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#141c32] via-[#1a2438] to-[#243044] p-5 shadow-card">
      <div className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-cta-gold/12 blur-2xl" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cta-gold/80">Next goal</p>
      <div className="mt-3 flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cta-gold">
          <Icon name="track_changes" className="text-2xl" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">Master 1 chapter</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {progress.remaining.toLocaleString()} XP remaining
          </p>
        </div>
      </div>
      <Link
        className="senior-cta mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold"
        params={{ lang, subject: "chemistry", chapter: "chapter-01" }}
        to="/f4/$lang/$subject/$chapter"
      >
        Continue Learning
        <Icon name="arrow_forward" className="text-lg" />
      </Link>
    </section>
  );
}
