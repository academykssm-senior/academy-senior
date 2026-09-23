import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { GoogleSignInButton } from "@/features/auth/GoogleSignInButton";
import { signInWithEmail } from "@/features/auth/authActions";
import { sanitizeNextPath } from "@/lib/returnTo";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { next: string } => ({
    next: sanitizeNextPath(typeof search.next === "string" ? search.next : undefined),
  }),
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Sign in — AcadeMY Senior" }],
  }),
});

function LoginPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const signIn = useServerFn(signInWithEmail);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    setMessage(null);
    try {
      const result = await signIn({ data: { email, password } });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      await navigate({ href: sanitizeNextPath(next) });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen
      subtitle="Form 4 and Form 5 — the next chapter of AcadeMY."
      title="Welcome back."
    >
      <AuthForm onSubmit={(event) => void onSubmit(event)}>
        <AuthField autoComplete="email" label="Email" name="email" type="email" />
        <AuthField autoComplete="current-password" label="Password" name="password" type="password" />
        <AuthSubmit pending={pending}>Sign in</AuthSubmit>
        <AuthError message={message} />
      </AuthForm>
      <GoogleSignInButton label="Continue with Google" next={next} />
      <p className="mt-6 text-sm text-on-surface-variant">
        <Link className={authLinkClass()} search={{ next }} to="/forgot-password">
          Forgot password
        </Link>
      </p>
      <p className="mt-3 text-sm text-on-surface-variant">
        New to Senior?{" "}
        <Link className={authLinkClass()} search={{ next }} to="/register">
          Create account
        </Link>
      </p>
    </AuthScreen>
  );
}
