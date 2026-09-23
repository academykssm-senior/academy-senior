import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AuthError,
  AuthField,
  AuthForm,
  AuthScreen,
  AuthSubmit,
  authLinkClass,
} from "@/features/auth/AuthScreen";
import { requestPasswordReset } from "@/features/auth/authActions";
import { sanitizeNextPath } from "@/lib/returnTo";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (search: Record<string, unknown>): { next: string } => ({
    next: sanitizeNextPath(typeof search.next === "string" ? search.next : undefined),
  }),
  component: ForgotPasswordPage,
  head: () => ({
    meta: [{ title: "Reset password — AcadeMY Senior" }],
  }),
});

function ForgotPasswordPage() {
  const { next } = Route.useSearch();
  const requestReset = useServerFn(requestPasswordReset);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    setPending(true);
    setMessage(null);
    try {
      const result = await requestReset({ data: { email } });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setSent(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send a reset email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen
      subtitle="We’ll email a recovery link for this Senior session."
      title="Reset your password."
    >
      {sent ? (
        <p className="text-sm text-on-surface-variant">
          If that email is registered, a reset link is on its way.
        </p>
      ) : (
        <AuthForm onSubmit={(event) => void onSubmit(event)}>
          <AuthField autoComplete="email" label="Email" name="email" type="email" />
          <AuthSubmit pending={pending}>Send reset link</AuthSubmit>
          <AuthError message={message} />
        </AuthForm>
      )}
      <p className="mt-6 text-sm text-on-surface-variant">
        <Link className={authLinkClass()} search={{ next }} to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthScreen>
  );
}
