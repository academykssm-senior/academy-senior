import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { sanitizeNextPath } from "@/lib/returnTo";
import type { AuthenticatedStudent } from "@/lib/studentIdentity";

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
    const { loadAuthenticatedStudent } = await import("@/features/auth/session.server");
    const student = await loadAuthenticatedStudent();
    if (student) return student;

    const next = sanitizeNextPath(`${data.pathname}${data.search}`);
    throw redirect({
      to: "/login",
      search: { next },
    });
  });

export const signOutStudent = createServerFn({ method: "POST" }).handler(async () => {
  const { signOutSeniorSession } = await import("@/features/auth/session.server");
  await signOutSeniorSession();
  throw redirect({ to: "/" });
});
