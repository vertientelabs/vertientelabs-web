import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the publishable (anon) key.
 * Row Level Security only allows INSERT into public.leads for this role,
 * so the key can never read submitted leads. Returns null when not configured.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
