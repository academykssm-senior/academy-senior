import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { LEARNING_TOOL_COPY } from "@/components/learning/toolMeta";
import type { ChapterView, RouteLanguage } from "@/types/curriculum";
import type { ChapterProgressSummary } from "@/types/progress";
import type { ContentLanguage } from "@/types/curriculum";

type ChapterCardProps = {
  chapter: ChapterView;
  lang: RouteLanguage;
  contentLang: ContentLanguage;
  chapterLabel: string;
  openLabel: string;
  progress?: ChapterProgressSummary;
};

export function ChapterCard({
  chapter,
  lang,
  contentLang,
  chapterLabel,
  openLabel,
  progress,
}: ChapterCardProps) {
  return (
    <Link
      className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/8 bg-surface-card px-4 py-3.5 transition hover:border-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-gold"
      params={{
        lang,
        subject: chapter.subjectSlug,
        chapter: chapter.slug,
      }}
      to="/f4/$lang/$subject/$chapter"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/6 text-xs font-bold text-on-surface">
        {String(chapter.number).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
          {chapterLabel} {chapter.number}
        </span>
        <span className="mt-0.5 block truncate font-display text-base font-semibold">
          {chapter.title}
        </span>
        <span className="mt-1 flex flex-wrap gap-1.5">
          {chapter.activities.map((toolId) => (
            <span
              className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-on-surface-variant"
              key={toolId}
            >
              {LEARNING_TOOL_COPY[toolId].title[contentLang]}
            </span>
          ))}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-primary">
        {progress?.completed ? (
          <Icon className="text-status-mastered" filled name="check_circle" />
        ) : (
          <>
            {openLabel}
            <span aria-hidden="true"> →</span>
          </>
        )}
      </span>
    </Link>
  );
}
