import type { CSSProperties, ReactNode } from "react";
import type { SubjectManifest } from "@/types/curriculum";
import type { SubjectProgressSummary } from "@/types/progress";

type SubjectHeroProps = {
  subject: SubjectManifest;
  name: string;
  description: string;
  formLabel: string;
  languageToggle?: ReactNode;
  progress?: SubjectProgressSummary;
  progressPlaceholder: string;
};

type HeroStyle = CSSProperties & {
  "--subject-accent": string;
};

export function SubjectHero({
  subject,
  name,
  description,
  formLabel,
  languageToggle,
  progress,
  progressPlaceholder,
}: SubjectHeroProps) {
  const style: HeroStyle = { "--subject-accent": subject.accent };

  return (
    <section
      className="overflow-hidden rounded-[28px] border border-white/8 bg-surface-card"
      style={style}
    >
      <div className="relative aspect-[16/7] min-h-[140px] w-full overflow-hidden sm:min-h-[180px]">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          src={subject.artwork}
          style={{ objectPosition: subject.artworkPosition ?? "center center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11172a] via-[#11172a]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {formLabel}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {name}
          </h1>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            {description}
          </p>
          {languageToggle}
        </div>
        <p className="mt-4 text-sm text-on-surface-variant">
          {progress
            ? `${progress.completedChapters} / ${progress.totalChapters}`
            : progressPlaceholder}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="block h-0.5 w-full"
        style={{ background: "var(--subject-accent)", opacity: 0.7 }}
      />
    </section>
  );
}
