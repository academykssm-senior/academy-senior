import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { requireAuthenticatedStudent } from "@/features/auth/session";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const student = await requireAuthenticatedStudent({
      data: {
        pathname: location.pathname,
        search: location.searchStr,
      },
    });
    return { student };
  },
  component: AppLayout,
});

function AppLayout() {
  const { student } = Route.useRouteContext();
  return (
    <AppShell student={student}>
      <Outlet />
    </AppShell>
  );
}
