import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getChapter } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter/flashcards")({
  beforeLoad: ({ params }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }
  },
  component: FlashcardsPlaceholderPage,
});

function FlashcardsPlaceholderPage() {
  const { lang, subject, chapter: chapterSlug } = Route.useParams();
  if (!isLanguageStream(lang)) {
    throw notFound();
  }

  const chapter = getChapter(4, subject, chapterSlug, lang);
  if (!chapter) {
    throw notFound();
  }

  const title = lang === "bm" ? "Kad imbas" : "Flashcards";
  const body =
    lang === "bm"
      ? "Kandungan kad imbas akan ditambah di sini. Aktiviti ini bersumber senior; XP kekal global."
      : "Flashcard content will go here. This activity is sourced as senior; XP stays global.";

  return (
    <div>
      <PageHeader
        title={title}
        back={
          <Link
            to="/f4/$lang/$subject/$chapter"
            params={{ lang, subject, chapter: chapterSlug }}
            className="underline-offset-4 hover:underline"
          >
            {chapter.title}
          </Link>
        }
      />
      <Card>
        <p className="text-sm text-text-secondary">{body}</p>
      </Card>
    </div>
  );
}
