import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { getForm, listSubjects } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/")({
  component: Form4SubjectsPage,
});

function Form4SubjectsPage() {
  const { lang } = Route.useParams();
  if (!isLanguageStream(lang)) throw notFound();

  const form = getForm(4);
  const subjects = listSubjects(4, lang);
  const title = lang === "bm" ? (form?.nameBm ?? "Tingkatan 4") : (form?.nameEn ?? "Form 4");
  const otherLang = lang === "bm" ? "dlp" : "bm";

  return (
    <div>
      <PageHeader
        back={<Link className="underline-offset-4 hover:underline" to="/dashboard">Dashboard</Link>}
        title={title}
      />
      <div aria-label="Language" className="mb-4 flex gap-2" role="group">
        <Link
          className="rounded-full bg-surface-raised px-3 py-1.5 text-sm text-nova-purple"
          params={{ lang: otherLang }}
          to="/f4/$lang"
        >
          {otherLang === "bm" ? "BM" : "DLP"}
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {subjects.map((subject) => (
          <li key={subject.slug}><SubjectCard lang={lang} subject={subject} /></li>
        ))}
      </ul>
    </div>
  );
}
