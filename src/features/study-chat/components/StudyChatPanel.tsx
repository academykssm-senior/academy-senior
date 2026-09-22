import { Icon } from "@/components/ui/Icon";
import { StudyChatInput } from "@/features/study-chat/components/StudyChatInput";
import { StudyChatMessageItem } from "@/features/study-chat/components/StudyChatMessage";
import { useStudyChat } from "@/features/study-chat/hooks/useStudyChat";
import { SENIOR_STUDY_CHAT_ROOM_ID } from "@/features/study-chat/services/mockStudyChatData";
import { cn } from "@/lib/utils";

type StudyChatPanelProps = {
  displayName: string;
  userId: string;
  className?: string;
};

export function StudyChatPanel({ displayName, userId, className }: StudyChatPanelProps) {
  const { state, send } = useStudyChat(SENIOR_STUDY_CHAT_ROOM_ID);

  return (
    <section
      aria-label="Study Chat"
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface-card",
        className,
      )}
    >
      <header className="shrink-0 border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="text-lg text-cta-gold" name="forum" />
          <h2 className="font-display text-base font-semibold text-white">Study Chat</h2>
        </div>
        <p className="mt-0.5 text-xs text-on-surface-variant">Learn together.</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {state.status === "loading" ? <StudyChatSkeleton /> : null}
        {state.status === "error" ? (
          <p className="text-sm text-on-surface-variant">{state.message}</p>
        ) : null}
        {state.status === "ready" && state.messages.length === 0 ? <StudyChatEmptyState /> : null}
        {state.status === "ready" && state.messages.length > 0 ? (
          <ul className="space-y-4">
            {state.messages.map((message) => (
              <li key={message.id}>
                <StudyChatMessageItem message={message} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="shrink-0 px-4 pb-4">
        <StudyChatInput
          disabled={state.status === "loading" || state.status === "error"}
          onSend={(body) => send({ body, displayName, userId })}
        />
      </div>
    </section>
  );
}

export function StudyChatEmptyState() {
  return (
    <div className="flex h-full min-h-36 flex-col justify-center">
      <p className="text-sm font-medium text-white">Start the conversation.</p>
      <p className="mt-1 text-sm text-on-surface-variant">No study messages yet.</p>
    </div>
  );
}

function StudyChatSkeleton() {
  return (
    <div className="space-y-4" role="status">
      <span className="sr-only">Loading Study Chat</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div className="flex gap-3" key={index}>
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/8" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-white/8" />
            <div className="h-8 w-full animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
