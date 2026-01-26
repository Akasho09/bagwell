import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Supabase env vars missing");
  }

  return createClient(url, anonKey);
}
