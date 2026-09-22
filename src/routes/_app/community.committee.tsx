import { createFileRoute } from "@tanstack/react-router";
import { CommitteeSection } from "@/components/landing/SeniorHomepage";

export const Route = createFileRoute("/_app/community/committee")({
  component: CommunityCommitteePage,
});

function CommunityCommitteePage() {
  return <CommitteeSection />;
}
