import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import type { ChapterActivityId, LanguageStream } from "@/types/curriculum";

type ActivityCardProps = {
  activity: ChapterActivityId;
  lang: LanguageStream;
  subject: string;
  chapter: string;
};

const LABELS: Record<
  ChapterActivityId,
  { bm: string; en: string; descriptionBm: string; descriptionEn: string }
> = {
  flashcards: {
    bm: "Kad imbas",
    en: "Flashcards",
    descriptionBm: "Ulang kaji kad untuk bab ini.",
    descriptionEn: "Review cards for this chapter.",
  },
  quiz: {
    bm: "Kuiz",
    en: "Quiz",
    descriptionBm: "Uji pemahaman bab ini.",
    descriptionEn: "Check your understanding of this chapter.",
  },
  "mind-map": {
    bm: "Peta minda",
    en: "Mind map",
    descriptionBm: "Lihat ringkasan visual bab ini.",
    descriptionEn: "See a visual summary of this chapter.",
  },
};

const ACTIVITY_TO: Record<
  ChapterActivityId,
  | "/f4/$lang/$subject/$chapter/flashcards"
  | "/f4/$lang/$subject/$chapter/quiz"
  | "/f4/$lang/$subject/$chapter/mind-map"
> = {
  flashcards: "/f4/$lang/$subject/$chapter/flashcards",
  quiz: "/f4/$lang/$subject/$chapter/quiz",
  "mind-map": "/f4/$lang/$subject/$chapter/mind-map",
};

export function ActivityCard({
  activity,
  lang,
  subject,
  chapter,
}: ActivityCardProps) {
  const copy = LABELS[activity];
  const title = lang === "bm" ? copy.bm : copy.en;
  const description = lang === "bm" ? copy.descriptionBm : copy.descriptionEn;

  return (
    <Link
      to={ACTIVITY_TO[activity]}
      params={{ lang, subject, chapter }}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-purple"
    >
      <Card className="border border-nova-purple/30 transition hover:border-nova-purple">
        <p className="font-display text-lg font-semibold text-nova-purple">
          {title}
        </p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </Card>
    </Link>
  );
}
