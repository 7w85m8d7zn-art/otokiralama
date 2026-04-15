import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const visitorId = String(body?.visitorId || "").trim();

    if (!visitorId || visitorId.length > 120) {
      return NextResponse.json({ ok: false, error: "Invalid visitorId" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const today = new Date().toISOString().slice(0, 10);

    await supabase.from("site_visits").upsert(
      {
        visitor_id: visitorId,
        visited_date: today
      },
      { onConflict: "visitor_id,visited_date" }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
