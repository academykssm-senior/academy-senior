import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { LEARNING_TOOL_COPY, LEARNING_TOOL_ROUTES } from "@/components/learning/toolMeta";
import type { ContentLanguage, RouteLanguage } from "@/types/curriculum";
import type { VisibleLearningToolId } from "@/types/learning";

type LearningToolCardProps = {
  toolId: VisibleLearningToolId;
  lang: RouteLanguage;
  contentLang: ContentLanguage;
  subject: string;
  chapter: string;
  available: boolean;
  completed?: boolean;
};

export function LearningToolCard({
  toolId,
  lang,
  contentLang,
  subject,
  chapter,
  available,
  completed,
}: LearningToolCardProps) {
  const copy = LEARNING_TOOL_COPY[toolId];
  const title = copy.title[contentLang];
  const description = copy.description[contentLang];
  const action = copy.action[contentLang];

  const inner = (
    <>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-container/20 text-primary">
        <Icon className="text-2xl" name={copy.icon} />
      </span>
      <span className="mt-3 block font-display text-base font-semibold">{title}</span>
      <span className="mt-1 block text-sm text-on-surface-variant">{description}</span>
      <span className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary">
        {completed ? (
          <>
            <Icon className="mr-1 text-status-mastered" filled name="check_circle" />
            {title}
          </>
        ) : (
          <>
            {action}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </>
        )}
      </span>
    </>
  );

  const className =
    "flex h-full min-h-40 flex-col rounded-2xl border border-white/8 bg-surface-card p-4 text-left transition hover:border-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nova-purple";

  if (!available) {
    return (
      <article className={`${className} opacity-60`}>
        {inner}
      </article>
    );
  }

  return (
    <Link
      className={className}
      params={{ lang, subject, chapter }}
      to={LEARNING_TOOL_ROUTES[toolId]}
    >
      {inner}
    </Link>
  );
}
