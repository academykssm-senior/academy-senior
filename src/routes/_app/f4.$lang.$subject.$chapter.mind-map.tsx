import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getChapter } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter/mind-map")({
  beforeLoad: ({ params }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }
  },
  component: MindMapPlaceholderPage,
});

function MindMapPlaceholderPage() {
  const { lang, subject, chapter: chapterSlug } = Route.useParams();
  if (!isLanguageStream(lang)) {
    throw notFound();
  }

  const chapter = getChapter(4, subject, chapterSlug, lang);
  if (!chapter) {
    throw notFound();
  }

  const title = lang === "bm" ? "Peta minda" : "Mind map";
  const body =
    lang === "bm"
      ? "Peta minda bab ini akan ditambah di sini."
      : "This chapter mind map will go here.";

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
