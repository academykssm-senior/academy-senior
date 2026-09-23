import { Link, createFileRoute } from "@tanstack/react-router";
import { AuthScreen, authLinkClass } from "@/features/auth/AuthScreen";

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ next }) => {
        const { handleSeniorOAuthCallbackGet } = await import(
          "@/features/auth/authCallback.server"
        );
        const result = await handleSeniorOAuthCallbackGet();
        if (result.ok) return result.response;
        return next({ context: { oauthError: result.message } });
      },
    },
  },
  beforeLoad: ({ serverContext }) => serverContext ?? {},
  component: AuthCallbackErrorPage,
  head: () => ({
    meta: [{ title: "Signing in — AcadeMY Senior" }],
  }),
});

function AuthCallbackErrorPage() {
  const { oauthError } = Route.useRouteContext() as { oauthError?: string };
  return (
    <AuthScreen
      subtitle={oauthError ?? "Please start Google sign-in again from Senior login."}
      title="Could not complete sign-in."
    >
      <p className="text-sm text-on-surface-variant">
        <Link className={authLinkClass()} search={{ next: "/home" }} to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthScreen>
  );
}
