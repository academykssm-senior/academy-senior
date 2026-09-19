import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { MasteryRing } from "@/components/dashboard/MasteryRing";
import type { LanguageStream } from "@/types/curriculum";

type ContinueMasteringCardProps = {
  lang: LanguageStream;
};

export function ContinueMasteringCard({ lang }: ContinueMasteringCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface-card p-4 shadow-card sm:p-6">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 opacity-20"
        fill="none"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="88" stroke="#d0bcff" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="62" stroke="#8083ff" strokeWidth="1.5" />
        <circle cx="162" cy="100" fill="#d0bcff" r="4" />
      </svg>

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Continue Mastering · Chapter 1
          </span>
          <span className="text-xs text-on-surface-variant">Chemistry · Form 4</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Atomic Structure</h2>
            <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">
              3 of 4 concepts ready for revision
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-status-mastered">
              <Icon filled name="verified" className="text-base" />
              Spaced recall due today
            </p>
          </div>
          <MasteryRing value={72} />
        </div>

        <Link
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 font-semibold text-on-primary shadow-primary transition hover:-translate-y-0.5 hover:bg-primary-fixed-dim motion-reduce:transform-none"
          params={{ lang, subject: "chemistry", chapter: "atomic-structure" }}
          to="/f4/$lang/$subject/$chapter"
        >
          Continue Revision
          <Icon name="arrow_forward" className="text-xl" />
        </Link>
      </div>
    </section>
  );
}
