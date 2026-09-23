import { createSupabaseServerClient } from "@/lib/supabase.server";
import { mapAuthenticatedStudent, type AuthenticatedStudent } from "@/lib/studentIdentity";

type ProfileQueryRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  form: string | null;
  school: string | null;
  schools: { school_name: string } | { school_name: string }[] | null;
};

export async function loadAuthenticatedStudent(): Promise<AuthenticatedStudent | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) return null;
  const userId = claims.sub;
  if (typeof userId !== "string" || userId.length === 0) return null;

  const authEmail = typeof claims.email === "string" ? claims.email : null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, form, school, school_id, schools:school_id ( school_name )")
    .eq("id", userId)
    .maybeSingle();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("language_preference")
    .eq("user_id", userId)
    .maybeSingle();

  return mapAuthenticatedStudent(
    userId,
    authEmail,
    (profile as ProfileQueryRow | null) ?? null,
    progress,
  );
}

export async function signOutSeniorSession(): Promise<void> {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}
