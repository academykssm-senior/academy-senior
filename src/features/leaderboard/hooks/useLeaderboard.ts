import { useEffect, useState } from "react";
import { getSeniorLeaderboard } from "@/features/leaderboard/services/leaderboardService";
import type {
  LeaderboardPeriod,
  LeaderboardSnapshot,
} from "@/features/leaderboard/types";

export type LeaderboardViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty"; snapshot: LeaderboardSnapshot }
  | { status: "ready"; snapshot: LeaderboardSnapshot };

export function useLeaderboard(
  period: LeaderboardPeriod,
  viewerPublicId: string,
  reloadToken = 0,
): LeaderboardViewState {
  const [state, setState] = useState<LeaderboardViewState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    getSeniorLeaderboard({ period, viewerPublicId })
      .then((snapshot) => {
        if (cancelled) return;
        if (snapshot.entries.length === 0) {
          setState({ status: "empty", snapshot });
          return;
        }
        setState({ status: "ready", snapshot });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "error",
          message: "The Senior League could not be loaded right now.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [period, viewerPublicId, reloadToken]);

  return state;
}
