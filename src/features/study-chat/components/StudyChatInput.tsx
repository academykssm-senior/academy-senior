import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { STUDY_CHAT_MAX_LENGTH } from "@/features/study-chat/services/studyChatService";
import type { SendStudyChatMessageResult } from "@/features/study-chat/types";

type StudyChatInputProps = {
  disabled?: boolean;
  onSend: (body: string) => Promise<SendStudyChatMessageResult>;
};

export function StudyChatInput({ disabled = false, onSend }: StudyChatInputProps) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || pending) return;

    setPending(true);
    setNotice(null);
    const result = await onSend(value);
    setPending(false);

    if (result.ok) {
      setValue("");
      return;
    }

    if (result.reason === "empty") setNotice("Write a message first.");
    if (result.reason === "too_long") setNotice("That message is too long.");
    if (result.reason === "rate_limited") setNotice("Please wait a moment before sending again.");
  }

  return (
    <form className="border-t border-white/8 pt-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="study-chat-input">
        Study Chat message
      </label>
      <div className="flex items-end gap-2">
        <textarea
          aria-describedby="study-chat-help"
          className="min-h-11 max-h-28 flex-1 resize-none rounded-xl border-0 bg-white/6 px-3 py-2.5 text-sm text-white outline-none placeholder:text-outline focus:ring-1 focus:ring-primary"
          disabled={disabled || pending}
          id="study-chat-input"
          maxLength={STUDY_CHAT_MAX_LENGTH}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Type a message…"
          rows={1}
          value={value}
        />
        <button
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-container text-on-primary-container disabled:opacity-40"
          disabled={disabled || pending || value.trim().length === 0}
          type="submit"
        >
          <Icon name="send" className="text-lg" />
        </button>
      </div>
      <p className="mt-2 text-[11px] text-on-surface-variant" id="study-chat-help">
        Messages stay on this device until Study Chat is connected.
      </p>
      {notice ? (
        <p className="mt-1 text-[11px] text-status-review" role="status">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
