import { getRequestUrl } from "@tanstack/react-start/server";
import { createSupabaseServerClient } from "@/lib/supabase.server";

export type AuthActionResult =
  | { ok: true; signedIn: boolean }
  | { ok: false; message: string };

export async function signInWithEmailOnServer(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Senior sign-in is not configured." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "Email or password is incorrect." };
  return { ok: true, signedIn: true };
}

export async function signUpWithEmailOnServer(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Senior registration is not configured." };
  const origin = getRequestUrl().origin;
  const { data: result, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/home")}`,
    },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, signedIn: Boolean(result.session) };
}

export async function requestPasswordResetOnServer(email: string): Promise<AuthActionResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Password recovery is not configured." };
  const origin = getRequestUrl().origin;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/home")}`,
  });
  if (error) return { ok: false, message: "Could not send a reset email. Try again." };
  return { ok: true, signedIn: false };
}
