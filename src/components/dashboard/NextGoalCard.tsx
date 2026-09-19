import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { getRankProgress } from "@/content/mock/dashboard";
import { mockStudent } from "@/content/mock/student";
import type { LanguageStream } from "@/types/curriculum";

export function NextGoalCard({ lang }: { lang: LanguageStream }) {
  const progress = getRankProgress(mockStudent.totalXp);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#3b1d73] via-[#5b21b6] to-[#7c3aed] p-5 shadow-card">
      <div className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-2xl" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100/80">Next goal</p>
      <div className="mt-3 flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white">
          <Icon name="track_changes" className="text-2xl" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">Master 1 chapter</h2>
          <p className="mt-1 text-sm text-violet-100">
            {progress.remaining.toLocaleString()} XP remaining
          </p>
        </div>
      </div>
      <Link
        className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-400 px-4 text-sm font-bold text-white shadow-primary transition hover:brightness-110"
        params={{ lang, subject: "chemistry", chapter: "atomic-structure" }}
        to="/f4/$lang/$subject/$chapter"
      >
        Continue Learning
        <Icon name="arrow_forward" className="text-lg" />
      </Link>
    </section>
  );
}
