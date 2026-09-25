import { sanitizeNextPath } from "./returnTo.ts";
import {
  SUPABASE_AUTH_COOKIE_NAME,
  getSupabaseAuthCookieOptions,
} from "./supabase-auth-cookie.ts";

const cases: Array<[string | null | undefined, string]> = [
  [null, "/home"],
  ["/home", "/home"],
  ["/dashboard", "/dashboard"],
  ["/learning", "/learning"],
  ["/f4/bm", "/f4/bm"],
  ["/f4/bm/chemistry", "/f4/bm/chemistry"],
  ["//evil.com", "/home"],
  ["https://www.myacademy.my/login", "/home"],
  ["http://localhost:5173/home", "/home"],
  ["/login", "/home"],
  ["/auth/callback", "/home"],
  ["https://senior.myacademy.my/learning", "/home"],
];

const failures = cases.flatMap(([input, expected]) => {
  const actual = sanitizeNextPath(input);
  return actual === expected ? [] : [`${String(input)} → ${actual} (expected ${expected})`];
});

if (failures.length > 0) {
  throw new Error(`sanitizeNextPath failed:\n${failures.join("\n")}`);
}

const productionCookies = getSupabaseAuthCookieOptions("senior.myacademy.my");
if (productionCookies.domain !== ".myacademy.my") {
  throw new Error("Senior production auth cookies must use Domain=.myacademy.my");
}
if (
  SUPABASE_AUTH_COOKIE_NAME !== "academy-auth-v1" ||
  productionCookies.path !== "/" ||
  productionCookies.sameSite !== "lax" ||
  productionCookies.secure !== true
) {
  throw new Error("Senior production cookies must be academy-auth-v1 Path=/ SameSite=lax Secure=true");
}

const localCookies = getSupabaseAuthCookieOptions("localhost");
if (localCookies.secure !== false || localCookies.domain !== undefined) {
  throw new Error("Localhost Senior cookies must be host-only and not Secure");
}
