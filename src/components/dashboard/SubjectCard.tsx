import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import type { LanguageStream, SubjectView } from "@/types/curriculum";

type SubjectCardProps = {
  subject: SubjectView;
  lang: LanguageStream;
};

export function SubjectCard({ subject, lang }: SubjectCardProps) {
  return (
    <Link
      to="/f4/$lang/$subject"
      params={{ lang, subject: subject.slug }}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-purple"
    >
      <Card className="transition hover:ring-1 hover:ring-nova-purple/60">
        <p className="font-display text-lg font-semibold">{subject.name}</p>
        <p className="mt-1 text-sm text-text-secondary">{subject.description}</p>
      </Card>
    </Link>
  );
}
