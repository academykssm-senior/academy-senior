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
          ? "rounded-full border border-cta-gold/30 bg-cta-gold/12 px-3 py-1.5 text-xs font-semibold text-cta-gold"
          : "rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white";

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
