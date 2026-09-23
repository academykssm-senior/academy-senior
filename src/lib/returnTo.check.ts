import { sanitizeNextPath } from "@/lib/returnTo";
import { getSupabaseAuthCookieOptions } from "@/lib/supabase-auth-cookie";

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
if ("domain" in productionCookies) {
  throw new Error("Senior auth cookies must not set Domain");
}
if (productionCookies.path !== "/" || productionCookies.sameSite !== "lax" || productionCookies.secure !== true) {
  throw new Error("Senior production cookies must be Path=/ SameSite=lax Secure=true");
}

const localCookies = getSupabaseAuthCookieOptions("localhost");
if (localCookies.secure !== false || "domain" in localCookies) {
  throw new Error("Localhost Senior cookies must be host-only and not Secure");
}
