import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { getChapter, getSubject } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter/")({
  component: ChapterHubPage,
});

function ChapterHubPage() {
  const { lang, subject: subjectSlug, chapter: chapterSlug } = Route.useParams();
  if (!isLanguageStream(lang)) throw notFound();

  const subject = getSubject(4, subjectSlug, lang);
  const chapter = getChapter(4, subjectSlug, chapterSlug, lang);
  if (!subject || !chapter) throw notFound();

  return (
    <div>
      <PageHeader
        back={
          <Link
            className="underline-offset-4 hover:underline"
            params={{ lang, subject: subjectSlug }}
            to="/f4/$lang/$subject"
          >
            {subject.name}
          </Link>
        }
        title={chapter.title}
      />
      <ul className="flex flex-col gap-3">
        {chapter.activities.map((activity) => (
          <li key={activity}>
            <ActivityCard
              activity={activity}
              chapter={chapterSlug}
              lang={lang}
              subject={subjectSlug}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
