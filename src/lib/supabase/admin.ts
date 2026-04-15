import { createClient } from "@supabase/supabase-js";
import { assertServiceEnv, supabaseServiceKey, supabaseUrl } from "./config";

let client: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdminClient() {
  if (client) return client;
  assertServiceEnv();

  client = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return client;
}
