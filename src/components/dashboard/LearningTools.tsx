import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { learningTools } from "@/content/mock/dashboard";
import type { LanguageStream } from "@/types/curriculum";

const toolRoutes = {
  "mind-map": "/f4/$lang/$subject/$chapter/mind-map",
  flashcards: "/f4/$lang/$subject/$chapter/flashcards",
  quiz: "/f4/$lang/$subject/$chapter/quiz",
} as const;

export function LearningTools({ lang }: { lang: LanguageStream }) {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-lg font-semibold">Core Learning Tools</h2>
        <span className="text-[10px] text-on-surface-variant">Active mastery flow</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {learningTools.map((tool) => (
          <Link
            className="group flex min-h-32 flex-col items-center rounded-2xl border border-transparent bg-surface-card p-3 text-center shadow-card transition hover:-translate-y-1 hover:border-border-subtle hover:bg-surface-container motion-reduce:transform-none"
            key={tool.id}
            params={{
              lang,
              subject: "chemistry",
              chapter: "atomic-structure",
            }}
            to={toolRoutes[tool.id]}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-container/20 text-primary transition group-hover:scale-110">
              <Icon name={tool.icon} className="text-2xl" />
            </span>
            <strong className="mt-2 text-xs sm:text-sm">{tool.title}</strong>
            <span className="mt-0.5 text-[10px] text-on-surface-variant">{tool.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
