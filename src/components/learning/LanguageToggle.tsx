import { Link } from "@tanstack/react-router";
import type { ContentLanguage, RouteLanguage } from "@/types/curriculum";

type LanguageToggleProps = {
  lang: RouteLanguage;
  languages: readonly ContentLanguage[];
  params: { lang: ContentLanguage; subject: string; chapter?: string };
  to: "/f4/$lang/$subject" | "/f4/$lang/$subject/$chapter";
};

export function LanguageToggle({ lang, languages, params, to }: LanguageToggleProps) {
  if (languages.length < 2) {
    return null;
  }

  const current = lang === "bm" ? "bm" : "en";

  return (
    <div aria-label="Language" className="flex gap-2" role="group">
      {languages.map((language) => {
        const selected = language === current;
        const className = selected
          ? "rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white"
          : "rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white";

        if (to === "/f4/$lang/$subject") {
          return (
            <Link
              aria-current={selected ? "true" : undefined}
              className={className}
              key={language}
              params={{ lang: language, subject: params.subject }}
              to="/f4/$lang/$subject"
            >
              {language === "bm" ? "BM" : "EN"}
            </Link>
          );
        }

        return (
          <Link
            aria-current={selected ? "true" : undefined}
            className={className}
            key={language}
            params={{
              lang: language,
              subject: params.subject,
              chapter: params.chapter ?? "",
            }}
            to="/f4/$lang/$subject/$chapter"
          >
            {language === "bm" ? "BM" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}
