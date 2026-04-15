"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv, supabaseAnonKey, supabaseUrl } from "./config";

export function createSupabaseBrowserClient() {
  assertSupabaseEnv();
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
