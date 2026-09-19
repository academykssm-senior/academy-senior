import { Link } from "@tanstack/react-router";
import type { ContentLanguage, RouteLanguage } from "@/types/curriculum";

type Crumb = {
  label: string;
  to?:
    | "/dashboard"
    | "/f4/$lang"
    | "/f4/$lang/$subject"
    | "/f4/$lang/$subject/$chapter";
  params?: {
    lang: RouteLanguage;
    subject?: string;
    chapter?: string;
  };
};

type LearningBreadcrumbsProps = {
  items: readonly Crumb[];
};

export function LearningBreadcrumbs({ items }: LearningBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-on-surface-variant">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.to && !isLast ? (
                item.to === "/dashboard" ? (
                  <Link className="hover:text-on-surface" to="/dashboard">
                    {item.label}
                  </Link>
                ) : item.to === "/f4/$lang" ? (
                  <Link
                    className="hover:text-on-surface"
                    params={{ lang: item.params?.lang as ContentLanguage }}
                    to="/f4/$lang"
                  >
                    {item.label}
                  </Link>
                ) : item.to === "/f4/$lang/$subject" ? (
                  <Link
                    className="hover:text-on-surface"
                    params={{
                      lang: item.params?.lang as ContentLanguage,
                      subject: item.params?.subject ?? "",
                    }}
                    to="/f4/$lang/$subject"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    className="hover:text-on-surface"
                    params={{
                      lang: item.params?.lang as ContentLanguage,
                      subject: item.params?.subject ?? "",
                      chapter: item.params?.chapter ?? "",
                    }}
                    to="/f4/$lang/$subject/$chapter"
                  >
                    {item.label}
                  </Link>
                )
              ) : (
                <span className={isLast ? "text-on-surface" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
