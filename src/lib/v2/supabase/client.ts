import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "../database.types";

function readPublicSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return { url, anonKey };
}

export function createV2BrowserClient() {
  const { url, anonKey } = readPublicSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
