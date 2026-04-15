import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Car } from "@/lib/types";

export async function getActiveCars() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as Car[];
  }

  return data as Car[];
}

export async function getAllCarsForAdmin() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return [] as Car[];
  }

  return data as Car[];
}

export async function getCarById(id: string) {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("cars").select("*").eq("id", id).single();
  return (data ?? null) as Car | null;
}
