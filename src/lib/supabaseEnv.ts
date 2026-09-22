type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = firstNonEmpty(
    readMeta("VITE_SUPABASE_URL"),
    readProcess("SUPABASE_URL"),
  );
  const anonKey = firstNonEmpty(
    readMeta("VITE_SUPABASE_ANON_KEY"),
    readProcess("SUPABASE_ANON_KEY"),
  );
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

function readMeta(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readProcess(name: "SUPABASE_URL" | "SUPABASE_ANON_KEY"): string | undefined {
  const runtime = globalThis as { process?: { env?: Record<string, string | undefined> } };
  const value = runtime.process?.env?.[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined && value.length > 0);
}
