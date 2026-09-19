import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { dashboardSubjects } from "@/content/mock/dashboard";
import type { LanguageStream, SubjectView } from "@/types/curriculum";

const accentClasses = {
  purple: "bg-primary/10 text-primary",
  indigo: "bg-tertiary-container/20 text-tertiary",
  emerald: "bg-status-mastered/15 text-status-mastered",
} as const;

type DashboardSubjectListProps = {
  lang: LanguageStream;
  subjects: readonly SubjectView[];
};

export function DashboardSubjectList({ lang, subjects }: DashboardSubjectListProps) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">My Subjects</h2>
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-on-surface-variant">
            {subjects.length} Active
          </span>
        </div>
        <Link className="text-xs font-semibold text-primary hover:underline" params={{ lang }} to="/f4/$lang">
          View All
        </Link>
      </div>

      <div className="space-y-2">
        {subjects.map((subject) => {
          const dashboardSubject = dashboardSubjects.find((item) => item.slug === subject.slug);
          if (!dashboardSubject) return null;

          return (
            <Link
              className="group flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-surface-card p-3.5 shadow-card transition hover:border-border-subtle hover:bg-surface-container"
              key={subject.slug}
              params={{ lang, subject: subject.slug }}
              to="/f4/$lang/$subject"
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accentClasses[dashboardSubject.accent]}`}>
                <Icon name={dashboardSubject.icon} className="text-2xl" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <strong className="truncate text-sm">{subject.name}</strong>
                </span>
                <span className="mt-1 block text-[10px] text-on-surface-variant">
                  {dashboardSubject.chapters} Chapters ·{" "}
                  <span className="font-medium text-status-mastered">{dashboardSubject.mastery}% Mastered</span>
                </span>
                <ProgressBar className="mt-1.5 max-w-40" label={`${subject.name} mastery`} value={dashboardSubject.mastery} />
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-container text-on-surface transition group-hover:bg-primary group-hover:text-on-primary">
                <Icon name="chevron_right" className="text-xl" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
