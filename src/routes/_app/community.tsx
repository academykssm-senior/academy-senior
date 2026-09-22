import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CommunitySubnav } from "@/components/community/CommunitySubnav";

export const Route = createFileRoute("/_app/community")({
  component: CommunityLayout,
});

function CommunityLayout() {
  return (
    <div>
      <CommunitySubnav />
      <Outlet />
    </div>
  );
}
