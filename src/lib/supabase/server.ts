import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseEnv, supabaseAnonKey, supabaseUrl } from "./config";

export function createSupabaseServerClient() {
  assertSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          (cookieStore as any).set(name, value, options as never);
        } catch {
          // Server Components cannot always write cookies; middleware refreshes sessions.
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          (cookieStore as any).set(name, "", { ...(options as object), maxAge: 0 } as never);
        } catch {
          // Server Components cannot always write cookies; middleware refreshes sessions.
        }
      }
    }
  });
}
