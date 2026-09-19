import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import type { ChapterView, LanguageStream } from "@/types/curriculum";

type ChapterCardProps = {
  chapter: ChapterView;
  lang: LanguageStream;
};

export function ChapterCard({ chapter, lang }: ChapterCardProps) {
  const chapterLabel = lang === "bm" ? "Bab" : "Chapter";

  return (
    <Link
      to="/f4/$lang/$subject/$chapter"
      params={{
        lang,
        subject: chapter.subjectSlug,
        chapter: chapter.slug,
      }}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-purple"
    >
      <Card className="transition hover:ring-1 hover:ring-nova-purple/60">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {chapterLabel} {chapter.number}
        </p>
        <p className="mt-1 font-display text-lg font-semibold">{chapter.title}</p>
      </Card>
    </Link>
  );
}
