import { StudentAvatar } from "@/components/ui/StudentAvatar";
import { formatRelativeActivity } from "@/features/leaderboard/lib/format";
import type { StudyChatMessage, StudyChatRole } from "@/features/study-chat/types";

const ROLE_LABEL: Record<Exclude<StudyChatRole, "student">, string> = {
  mentor: "Mentor",
  prefect: "Prefect",
};

type StudyChatMessageItemProps = {
  message: StudyChatMessage;
};

export function StudyChatMessageItem({ message }: StudyChatMessageItemProps) {
  const roleLabel = message.role === "student" ? null : ROLE_LABEL[message.role];

  return (
    <article className="flex gap-3">
      <StudentAvatar name={message.displayName} size="sm" src={message.avatarUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-sm font-semibold text-white">{message.displayName}</p>
          {roleLabel ? (
            <span className="rounded-md bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {roleLabel}
            </span>
          ) : null}
          <time
            className="ml-auto text-[11px] text-on-surface-variant"
            dateTime={message.createdAt}
          >
            {formatRelativeActivity(message.createdAt)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-on-surface-variant">
          {message.body}
        </p>
      </div>
    </article>
  );
}
