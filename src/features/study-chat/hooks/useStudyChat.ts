import { useCallback, useEffect, useState } from "react";
import { SENIOR_STUDY_CHAT_ROOM_ID } from "@/features/study-chat/services/mockStudyChatData";
import {
  listStudyChatMessages,
  sendStudyChatMessage,
} from "@/features/study-chat/services/studyChatService";
import type { SendStudyChatMessageResult, StudyChatMessage } from "@/features/study-chat/types";

export type StudyChatViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; messages: StudyChatMessage[] };

export function useStudyChat(roomId: string = SENIOR_STUDY_CHAT_ROOM_ID) {
  const [state, setState] = useState<StudyChatViewState>({ status: "loading" });

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const messages = await listStudyChatMessages(roomId);
      setState({ status: "ready", messages });
    } catch {
      setState({
        status: "error",
        message: "Study Chat could not be loaded right now.",
      });
    }
  }, [roomId]);

  useEffect(() => {
    let cancelled = false;

    listStudyChatMessages(roomId)
      .then((messages) => {
        if (!cancelled) setState({ status: "ready", messages });
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Study Chat could not be loaded right now.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const send = useCallback(
    async (input: {
      body: string;
      displayName: string;
      userId: string;
    }): Promise<SendStudyChatMessageResult> => {
      const result = await sendStudyChatMessage({
        roomId,
        body: input.body,
        displayName: input.displayName,
        userId: input.userId,
      });

      if (result.ok) {
        setState((current) => {
          if (current.status !== "ready") return current;
          return { status: "ready", messages: [...current.messages, result.message] };
        });
      }

      return result;
    },
    [roomId],
  );

  return { state, send, refresh };
}
