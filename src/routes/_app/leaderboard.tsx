import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardPage } from "@/features/leaderboard/components/LeaderboardPage";

export const Route = createFileRoute("/_app/leaderboard")({
  component: LeaderboardRoute,
});

function LeaderboardRoute() {
  return <LeaderboardPage />;
}
