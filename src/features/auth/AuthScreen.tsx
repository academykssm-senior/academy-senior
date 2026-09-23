import type { FormEvent, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-surface text-on-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgb(232_184_74/12%),transparent_42%),radial-gradient(ellipse_at_90%_80%,rgb(158_179_199/10%),transparent_50%)]"
      />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
        <Link className="mb-10 inline-flex items-center gap-2" to="/">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#2a2418] to-cta-gold text-sm font-bold text-cta-gold-on">
            A
          </span>
          <span className="text-base font-bold tracking-tight">AcadeMY</span>
          <span className="rounded-full border border-cta-gold/25 bg-cta-gold/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cta-gold">
            Senior
          </span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function AuthField({
  label,
  type,
  name,
  autoComplete,
  required = true,
}: {
  label: string;
  type: string;
  name: string;
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-on-surface outline-none placeholder:text-outline focus:border-cta-gold/40 focus:ring-1 focus:ring-cta-gold/30"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

export function AuthSubmit({
  children,
  pending,
}: {
  children: string;
  pending: boolean;
}) {
  return (
    <button
      className="senior-cta mt-6 flex min-h-12 w-full items-center justify-center rounded-full text-sm font-bold disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-4 text-sm text-semantic-error" role="alert">
      {message}
    </p>
  );
}

export function AuthForm({
  onSubmit,
  children,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function authLinkClass(className?: string): string {
  return cn("font-semibold text-cta-gold hover:text-primary-fixed", className);
}
