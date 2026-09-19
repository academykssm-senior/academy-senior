import { LearningBreadcrumbs } from "@/components/learning/LearningBreadcrumbs";
import { EmptyState } from "@/components/learning/EmptyState";
import { LEARNING_TOOL_COPY } from "@/components/learning/toolMeta";
import type { ChapterManifest, RouteLanguage, SubjectManifest } from "@/types/curriculum";
import type { ContentLanguage } from "@/types/curriculum";
import type { VisibleLearningToolId } from "@/types/learning";
import { pickLocalized } from "@/features/curriculum";

type LearningToolShellProps = {
  lang: RouteLanguage;
  contentLang: ContentLanguage;
  subject: SubjectManifest;
  chapter: ChapterManifest;
  toolId: VisibleLearningToolId;
  available: boolean;
  formLabel: string;
};

export function LearningToolShell({
  lang,
  contentLang,
  subject,
  chapter,
  toolId,
  available,
  formLabel,
}: LearningToolShellProps) {
  const copy = LEARNING_TOOL_COPY[toolId];
  const toolTitle = copy.title[contentLang];
  const chapterTitle = pickLocalized(
    lang,
    chapter.titleBm ?? chapter.title,
    chapter.titleEn ?? chapter.title,
  );
  const subjectName = pickLocalized(
    lang,
    subject.nameBm ?? subject.name,
    subject.nameEn ?? subject.name,
  );

  return (
    <div>
      <LearningBreadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: formLabel, to: "/f4/$lang", params: { lang } },
          {
            label: subjectName,
            to: "/f4/$lang/$subject",
            params: { lang, subject: subject.id },
          },
          {
            label: chapterTitle,
            to: "/f4/$lang/$subject/$chapter",
            params: { lang, subject: subject.id, chapter: chapter.id },
          },
          { label: toolTitle },
        ]}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
        {subjectName} · {formLabel}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {toolTitle}
      </h1>
      <p className="mt-1 text-sm text-on-surface-variant">{chapterTitle}</p>
      <div className="mt-6">
        {available ? (
          <EmptyState
            title={toolTitle}
            body={
              contentLang === "bm"
                ? "Kandungan akan ditambah dalam fasa seterusnya."
                : "Content will be added in a later phase."
            }
          />
        ) : (
          <EmptyState
            title={contentLang === "bm" ? "Tidak tersedia" : "Unavailable"}
            body={
              contentLang === "bm"
                ? "Alat pembelajaran ini belum dibuka untuk bab ini."
                : "This learning tool is not available for this chapter."
            }
          />
        )}
      </div>
    </div>
  );
}
