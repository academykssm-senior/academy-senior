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
import { signUpWithEmail } from "@/features/auth/authActions";
import { sanitizeNextPath } from "@/lib/returnTo";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): { next: string } => ({
    next: sanitizeNextPath(typeof search.next === "string" ? search.next : undefined),
  }),
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "Create account — AcadeMY Senior" }],
  }),
});

function RegisterPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const signUp = useServerFn(signUpWithEmail);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    setMessage(null);
    setInfo(null);
    try {
      const result = await signUp({ data: { email, password } });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      if (!result.signedIn) {
        setInfo("Check your email to confirm this account, then sign in.");
        return;
      }
      await navigate({ href: sanitizeNextPath(next) });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create the account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthScreen
      subtitle="Use your AcadeMY email. One account — Senior keeps its own session."
      title="Create your Senior account."
    >
      <AuthForm onSubmit={(event) => void onSubmit(event)}>
        <AuthField autoComplete="email" label="Email" name="email" type="email" />
        <AuthField autoComplete="new-password" label="Password" name="password" type="password" />
        <AuthSubmit pending={pending}>Create account</AuthSubmit>
        <AuthError message={message} />
        {info ? <p className="mt-4 text-sm text-on-surface-variant">{info}</p> : null}
      </AuthForm>
      <GoogleSignInButton label="Continue with Google" next={next} />
      <p className="mt-6 text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link className={authLinkClass()} search={{ next }} to="/login">
          Sign in
        </Link>
      </p>
    </AuthScreen>
  );
}
