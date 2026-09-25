import { createChunks } from "@supabase/ssr";
import { authenticatedUserIdFromClaims } from "./studentIdentity.ts";
import {
  SUPABASE_AUTH_COOKIE_ENCODING,
  SUPABASE_AUTH_COOKIE_NAME,
  getSupabaseAuthCookieOptions,
  getSupabaseCookieWrites,
  migrateBrowserAuthCookies,
} from "./supabase-auth-cookie.ts";

const project = "https://aojrbxoqbgyxmfljqpqj.supabase.co";
const failures: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

const production = getSupabaseAuthCookieOptions("senior.myacademy.my");
check(SUPABASE_AUTH_COOKIE_NAME === "academy-auth-v1", "production storage key must be academy-auth-v1");
check(production.domain === ".myacademy.my", "production Domain must be .myacademy.my");
check(production.secure === true, "production cookies must be Secure");
check(production.path === "/" && production.sameSite === "lax", "production Path=/ SameSite=Lax");
check(SUPABASE_AUTH_COOKIE_ENCODING === "base64url", "cookie encoding must stay base64url");

const local = getSupabaseAuthCookieOptions("localhost");
check(local.domain === undefined, "localhost must stay host-only");
check(local.secure === false, "localhost over http must not be Secure");
check(getSupabaseAuthCookieOptions("localhost", true).domain === undefined, "https localhost stays host-only");

const chunks = createChunks(SUPABASE_AUTH_COOKIE_NAME, "session-".repeat(800)).map((chunk) => ({
  ...chunk,
  options: { path: "/wrong" as const, maxAge: 3600 },
}));
check(chunks.length > 1, "a large session must split into chunks");
const chunkWrites = getSupabaseCookieWrites(chunks, [], project, "senior.myacademy.my", true);
const scopedChunks = chunkWrites.slice(-chunks.length);
check(
  scopedChunks.every(
    (write) =>
      write.options.domain === ".myacademy.my" &&
      write.options.path === "/" &&
      write.options.secure === true &&
      write.options.maxAge === 3600,
  ),
  "server writes must keep Domain on every chunk",
);
check(
  chunkWrites.slice(0, -chunks.length).every((write) => write.options.domain === undefined && write.options.maxAge === 0),
  "chunk writes must clear host-only copies first",
);

const logoutWrites = getSupabaseCookieWrites(
  [
    { name: `${SUPABASE_AUTH_COOKIE_NAME}.0`, value: "", options: { maxAge: 0 } },
    { name: `${SUPABASE_AUTH_COOKIE_NAME}.1`, value: "", options: { maxAge: 0 } },
  ],
  [
    { name: `${SUPABASE_AUTH_COOKIE_NAME}.0`, value: "old" },
    { name: `${SUPABASE_AUTH_COOKIE_NAME}.1`, value: "old" },
  ],
  project,
  "www.myacademy.my",
);
const sharedLogout = logoutWrites.filter((write) => write.options.domain === ".myacademy.my");
check(
  sharedLogout.length === 2 && sharedLogout.every((write) => write.value === "" && write.options.maxAge === 0),
  "logout must delete the shared .myacademy.my cookie",
);
check(
  logoutWrites.some((write) => write.options.domain === undefined && write.options.maxAge === 0),
  "logout must also clear host-only copies",
);

const localWrite = getSupabaseCookieWrites(
  [{ name: SUPABASE_AUTH_COOKIE_NAME, value: "local", options: { domain: "wrong.example" } }],
  [],
  project,
  "localhost",
);
check(localWrite.length === 1 && localWrite[0]?.options.domain === undefined, "localhost writes must not set Domain");

const userId = "11111111-1111-1111-1111-111111111111";
check(authenticatedUserIdFromClaims({ sub: userId }) === userId, "profile lookup must use claims.sub");
check(authenticatedUserIdFromClaims(null) === null, "missing claims must not invent a profile id");
check(authenticatedUserIdFromClaims({ sub: "" }) === null, "empty sub must not look up a profile");

const localJar = new Map<string, string>([
  [`${SUPABASE_AUTH_COOKIE_NAME}.0`, "old0"],
  ["sb-aojrbxoqbgyxmfljqpqj-auth-token.0", "legacy"],
]);
const parentJar = new Map<string, string>();
migrateBrowserAuthCookies(
  () => [...localJar, ...parentJar].map(([name, value]) => ({ name, value })),
  ({ name, value, options }) => {
    const jar = options.domain ? parentJar : localJar;
    if (options.maxAge === 0) jar.delete(name);
    else jar.set(name, value);
  },
  project,
  "senior.myacademy.my",
  true,
);
check(localJar.size === 0, "migration must remove host-only auth cookies");
check(parentJar.get(`${SUPABASE_AUTH_COOKIE_NAME}.0`) === "old0", "migration must promote academy-auth-v1");
check(!parentJar.has("sb-aojrbxoqbgyxmfljqpqj-auth-token.0"), "legacy sb- cookies must not be migrated");

if (failures.length > 0) {
  throw new Error(`supabase auth cookie checks failed:\n${failures.join("\n")}`);
}
