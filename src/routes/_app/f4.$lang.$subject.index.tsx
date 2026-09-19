import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChapterCard } from "@/components/dashboard/ChapterCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSubject, listChapters } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/")({
  component: SubjectChaptersPage,
});

function SubjectChaptersPage() {
  const { lang, subject: subjectSlug } = Route.useParams();
  if (!isLanguageStream(lang)) throw notFound();

  const subject = getSubject(4, subjectSlug, lang);
  if (!subject) throw notFound();

  const chapters = listChapters(4, subjectSlug, lang);
  const backLabel = lang === "bm" ? "Subjek" : "Subjects";

  return (
    <div>
      <PageHeader
        back={
          <Link className="underline-offset-4 hover:underline" params={{ lang }} to="/f4/$lang">
            {backLabel}
          </Link>
        }
        title={subject.name}
      />
      <ul className="flex flex-col gap-3">
        {chapters.map((chapter) => (
          <li key={chapter.slug}><ChapterCard chapter={chapter} lang={lang} /></li>
        ))}
      </ul>
    </div>
  );
}
