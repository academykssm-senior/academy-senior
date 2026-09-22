import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { getRequestUrl } from "@tanstack/react-start/server";
import { getMainHomeUrl, getMainLoginUrl } from "@/lib/appUrls";
import { sanitizeReturnTo } from "@/lib/returnTo";
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

type GuardInput = {
  pathname: string;
  search: string;
};

export const requireAuthenticatedStudent = createServerFn({ method: "GET" })
  .validator((data: unknown): GuardInput => {
    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid auth guard input");
    }
    const record = data as Record<string, unknown>;
    const pathname = record.pathname;
    const search = record.search;
    if (typeof pathname !== "string" || !pathname.startsWith("/") || pathname.startsWith("//")) {
      throw new Error("Invalid auth guard path");
    }
    return {
      pathname,
      search: typeof search === "string" && search.startsWith("?") ? search : "",
    };
  })
  .handler(async ({ data }): Promise<AuthenticatedStudent> => {
    const student = await loadAuthenticatedStudent();
    if (student) return student;

    const origin = getRequestUrl().origin;
    const next = sanitizeReturnTo(`${origin}${data.pathname}${data.search}`, origin);
    throw redirect({
      href: `${getMainLoginUrl()}?next=${encodeURIComponent(next)}`,
    });
  });

export const signOutStudent = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  throw redirect({ href: getMainHomeUrl() });
});

async function loadAuthenticatedStudent(): Promise<AuthenticatedStudent | null> {
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
