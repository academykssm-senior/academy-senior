import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import type { LanguageStream, SubjectView } from "@/types/curriculum";

type SubjectCardProps = {
  subject: SubjectView;
  lang: LanguageStream;
};

export function SubjectCard({ subject, lang }: SubjectCardProps) {
  const comingSoon = lang === "bm" ? "Akan datang" : "Coming soon";

  const body = (
    <Card className={subject.hasChapters ? "transition hover:ring-1 hover:ring-nova-purple/60" : "opacity-80"}>
      <p className="font-display text-lg font-semibold">{subject.name}</p>
      <p className="mt-1 text-sm text-text-secondary">{subject.description}</p>
      {!subject.hasChapters ? (
        <p className="mt-2 text-xs font-medium text-text-secondary">{comingSoon}</p>
      ) : null}
    </Card>
  );

  if (!subject.hasChapters) {
    return body;
  }

  return (
    <Link
      to="/f4/$lang/$subject"
      params={{ lang, subject: subject.slug }}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-purple"
    >
      {body}
    </Link>
  );
}
