import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { revisionMission } from "@/content/mock/dashboard";
import type { LanguageStream } from "@/types/curriculum";

type RevisionMissionCardProps = {
  lang: LanguageStream;
};

export function RevisionMissionCard({ lang }: RevisionMissionCardProps) {
  return (
    <section className="rounded-3xl border border-border-subtle bg-surface-card p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-status-review/15 text-status-review">
            <Icon name="track_changes" className="text-lg" />
          </span>
          <h2 className="text-lg font-semibold">Today&apos;s Mission</h2>
        </div>
        <span className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] text-on-surface-variant">
          ~12 mins
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {revisionMission.map((item) => (
          <div
            className="flex min-w-0 flex-col items-center rounded-2xl bg-surface-container p-3 text-center"
            key={item.label}
          >
            <Icon name={item.icon} className="text-xl text-primary" />
            <strong className="mt-1 text-lg">{item.value}</strong>
            <span className="text-[10px] text-on-surface-variant">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-3 rounded-2xl bg-surface-container-low p-3.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
          <Icon name="auto_awesome" className="text-lg" />
        </span>
        <p className="text-xs leading-relaxed text-on-surface-variant">
          <strong className="block text-primary">Ace Advice</strong>
          Revising Atomic Structure today will strengthen your next Chemistry quiz.
        </p>
      </div>

      <Link
        className="senior-cta mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
        params={{ lang, subject: "chemistry", chapter: "chapter-01" }}
        to="/f4/$lang/$subject/$chapter"
      >
        <Icon name="play_arrow" className="text-lg" />
        Start Session
      </Link>
    </section>
  );
}
