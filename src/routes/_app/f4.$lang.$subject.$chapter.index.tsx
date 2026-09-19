import { createFileRoute, notFound } from "@tanstack/react-router";
import { EmptyState } from "@/components/learning/EmptyState";
import { LanguageToggle } from "@/components/learning/LanguageToggle";
import { LearningBreadcrumbs } from "@/components/learning/LearningBreadcrumbs";
import { LearningToolCard } from "@/components/learning/LearningToolCard";
import {
  getAvailableLanguages,
  getFormManifest,
  isLearningToolAvailable,
  pickLocalized,
  resolveChapterContext,
} from "@/features/curriculum";
import { isLanguageStream, toContentLanguage } from "@/types/curriculum";
import { VISIBLE_LEARNING_TOOLS } from "@/types/learning";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter/")({
  component: ChapterPage,
});

function ChapterPage() {
  const { lang, subject: subjectId, chapter: chapterParam } = Route.useParams();
  if (!isLanguageStream(lang)) throw notFound();

  const resolved = resolveChapterContext(4, lang, subjectId, chapterParam);
  if (!resolved.ok) throw notFound();

  const { subject, chapter } = resolved;
  const contentLang = toContentLanguage(lang) ?? "en";
  const form = getFormManifest(4);
  const formLabel = pickLocalized(lang, form?.nameBm ?? "Tingkatan 4", form?.nameEn ?? "Form 4");
  const subjectName = pickLocalized(
    lang,
    subject.nameBm ?? subject.name,
    subject.nameEn ?? subject.name,
  );
  const chapterTitle = pickLocalized(
    lang,
    chapter.titleBm ?? chapter.title,
    chapter.titleEn ?? chapter.title,
  );
  const languages = getAvailableLanguages(chapter);
  const tools = VISIBLE_LEARNING_TOOLS.filter((toolId) =>
    isLearningToolAvailable(chapter.tools, toolId),
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
          { label: chapterTitle },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
            {subjectName} · {contentLang === "bm" ? "Bab" : "Chapter"}{" "}
            {String(chapter.number).padStart(2, "0")}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {chapterTitle}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {contentLang === "bm"
              ? "Kemajuan bab akan dipaparkan di sini."
              : "Chapter progress will appear here."}
          </p>
        </div>
        <LanguageToggle
          lang={lang}
          languages={languages}
          params={{ lang: contentLang, subject: subject.id, chapter: chapter.id }}
          to="/f4/$lang/$subject/$chapter"
        />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          {contentLang === "bm" ? "Alat pembelajaran" : "Learning tools"}
        </h2>
        {tools.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title={contentLang === "bm" ? "Akan datang" : "Coming soon"}
              body={
                contentLang === "bm"
                  ? "Alat pembelajaran untuk bab ini belum dibuka."
                  : "Learning tools for this chapter are not available yet."
              }
            />
          </div>
        ) : (
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {tools.map((toolId) => (
              <li key={toolId}>
                <LearningToolCard
                  available
                  chapter={chapter.id}
                  contentLang={contentLang}
                  lang={lang}
                  subject={subject.id}
                  toolId={toolId}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
