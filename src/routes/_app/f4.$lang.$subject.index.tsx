import { createFileRoute, notFound } from "@tanstack/react-router";
import { ChapterCard } from "@/components/learning/ChapterCard";
import { EmptyState } from "@/components/learning/EmptyState";
import { LanguageToggle } from "@/components/learning/LanguageToggle";
import { LearningBreadcrumbs } from "@/components/learning/LearningBreadcrumbs";
import { SubjectHero } from "@/components/learning/SubjectHero";
import {
  getFormManifest,
  getSubjectLanguages,
  listChapters,
  pickLocalized,
  resolveSubjectContext,
} from "@/features/curriculum";
import { isLanguageStream, toContentLanguage } from "@/types/curriculum";
import type { ContinueLearningPoint } from "@/types/progress";

export const Route = createFileRoute("/_app/f4/$lang/$subject/")({
  component: SubjectPage,
});

function SubjectPage() {
  const { lang, subject: subjectId } = Route.useParams();
  if (!isLanguageStream(lang)) throw notFound();

  const resolved = resolveSubjectContext(4, lang, subjectId);
  if (!resolved.ok) throw notFound();

  const { subject } = resolved;
  const contentLang = toContentLanguage(lang) ?? "en";
  const form = getFormManifest(4);
  const formLabel = pickLocalized(lang, form?.nameBm ?? "Tingkatan 4", form?.nameEn ?? "Form 4");
  const name = pickLocalized(lang, subject.nameBm ?? subject.name, subject.nameEn ?? subject.name);
  const description = pickLocalized(
    lang,
    subject.descriptionBm ?? subject.descriptionEn ?? "",
    subject.descriptionEn ?? subject.descriptionBm ?? "",
  );
  const chapters = listChapters(4, subject.id, lang);
  const languages = getSubjectLanguages(subject);
  const lastActivity: ContinueLearningPoint | undefined = undefined;

  return (
    <div>
      <LearningBreadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: formLabel, to: "/f4/$lang", params: { lang } },
          { label: name },
        ]}
      />
      <SubjectHero
        description={description}
        formLabel={formLabel}
        languageToggle={
          <LanguageToggle
            lang={lang}
            languages={languages}
            params={{ lang: contentLang, subject: subject.id }}
            to="/f4/$lang/$subject"
          />
        }
        name={name}
        progressPlaceholder={
          contentLang === "bm"
            ? "Kemajuan akan dipaparkan di sini."
            : "Progress will appear here as you learn."
        }
        subject={subject}
      />

      {lastActivity ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">
            {contentLang === "bm" ? "Teruskan pembelajaran" : "Continue Learning"}
          </h2>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          {contentLang === "bm" ? "Bab" : "Chapters"}
        </h2>
        {chapters.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title={contentLang === "bm" ? "Akan datang" : "Coming soon"}
              body={
                contentLang === "bm"
                  ? "Kandungan untuk subjek ini akan datang."
                  : "Content for this subject is coming soon."
              }
            />
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {chapters.map((chapter) => (
              <li key={chapter.slug}>
                <ChapterCard
                  chapter={chapter}
                  chapterLabel={contentLang === "bm" ? "Bab" : "Chapter"}
                  contentLang={contentLang}
                  lang={lang}
                  openLabel={contentLang === "bm" ? "Buka" : "Open"}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
