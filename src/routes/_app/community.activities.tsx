import { createFileRoute } from "@tanstack/react-router";
import { ActivitiesSection } from "@/components/landing/SeniorHomepage";

export const Route = createFileRoute("/_app/community/activities")({
  component: CommunityActivitiesPage,
});

function CommunityActivitiesPage() {
  return <ActivitiesSection />;
}
