import { createFileRoute, notFound } from "@tanstack/react-router";
import { LearningToolRouteView } from "@/components/learning/LearningToolRouteView";
import { resolveToolContext } from "@/features/curriculum";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter/flashcards")({
  beforeLoad: ({ params }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }
    const resolved = resolveToolContext(
      4,
      params.lang,
      params.subject,
      params.chapter,
      "flashcards",
    );
    if (!resolved.ok) {
      throw notFound();
    }
  },
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const { lang, subject, chapter } = Route.useParams();
  return (
    <LearningToolRouteView
      chapterId={chapter}
      lang={lang}
      subjectId={subject}
      toolId="flashcards"
    />
  );
}
