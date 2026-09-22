import { createFileRoute } from "@tanstack/react-router";
import { CouncilSection } from "@/components/landing/SeniorHomepage";

export const Route = createFileRoute("/_app/community/student-council")({
  component: CommunityCouncilPage,
});

function CommunityCouncilPage() {
  return <CouncilSection />;
}
