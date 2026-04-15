"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

const carSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  model_year: z.coerce.number().int().min(1990).max(2100),
  fuel_type: z.enum(["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"]),
  transmission: z.enum(["Manuel", "Otomatik"]),
  capacity: z.coerce.number().int().min(1).max(20),
  luggage: z.coerce.number().int().min(0).max(20),
  daily_price: z.coerce.number().min(0),
  monthly_price: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0),
  badge: z.enum(["Ekonomik", "Prestij", "Ozel Firsat", "Özel Fırsat", ""]),
  image_url: z.string().optional(),
  is_active: z.coerce.boolean(),
  is_rented: z.coerce.boolean()
});

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorMessage = error.message.includes("Legacy API keys are disabled")
      ? "Supabase anahtarı eski tipte. Vercel ortam değişkenlerinde NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kullanın."
      : error.message;
    redirect(`/giris?error=${encodeURIComponent(errorMessage)}`);
  }

  redirect("/admin?tab=dashboard");
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/giris");
}

export async function saveCarAction(formData: FormData) {
  await requireAdmin();
  const adminClient = createSupabaseAdminClient();

  const rawId = String(formData.get("id") || "").trim();
  const file = formData.get("image_file") as File | null;
  let imageUrl = String(formData.get("image_url") || "").trim();

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${randomUUID()}.${ext}`;

    const { error: uploadError } = await adminClient.storage.from("car-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg"
    });

    if (!uploadError) {
      const {
        data: { publicUrl }
      } = adminClient.storage.from("car-images").getPublicUrl(path);
      imageUrl = publicUrl;
    }
  }

  const parsed = carSchema.safeParse({
    id: rawId || undefined,
    name: formData.get("name"),
    model_year: formData.get("model_year"),
    fuel_type: formData.get("fuel_type"),
    transmission: formData.get("transmission"),
    capacity: formData.get("capacity"),
    luggage: formData.get("luggage"),
    daily_price: formData.get("daily_price"),
    monthly_price: formData.get("monthly_price"),
    deposit: formData.get("deposit"),
    badge: formData.get("badge"),
    image_url: imageUrl,
    is_active: formData.get("is_active") === "on",
    is_rented: formData.get("is_rented") === "on"
  });

  if (!parsed.success) {
    redirect(`/admin?error=${encodeURIComponent("Araç verileri geçersiz")}`);
  }

  const payload = {
    name: parsed.data.name,
    model_year: parsed.data.model_year,
    fuel_type: parsed.data.fuel_type,
    transmission: parsed.data.transmission,
    capacity: parsed.data.capacity,
    luggage: parsed.data.luggage,
    daily_price: parsed.data.daily_price,
    monthly_price: parsed.data.monthly_price,
    deposit: parsed.data.deposit,
    badge: parsed.data.badge || null,
    image_url: parsed.data.image_url || null,
    is_active: parsed.data.is_active,
    is_rented: parsed.data.is_rented
  };

  if (parsed.data.id) {
    await adminClient.from("cars").update(payload).eq("id", parsed.data.id);
  } else {
    await adminClient.from("cars").insert(payload);
  }

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");
}

export async function deleteCarAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const adminClient = createSupabaseAdminClient();
  await adminClient.from("cars").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/admin");
}

export async function updateSettingAction(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key") || "").trim();
  const value = String(formData.get("value") || "").trim();
  const type = String(formData.get("type") || "string");

  if (!key) return;

  let parsedValue: unknown = value;
  if (type === "json") {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      redirect(`/admin?error=${encodeURIComponent(`${key} JSON formatı hatalı`)}`);
    }
  }

  const adminClient = createSupabaseAdminClient();
  await adminClient.from("site_settings").upsert({ key, value: parsedValue }, { onConflict: "key" });

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

async function upsertJsonSetting(key: string, value: unknown) {
  await requireAdmin();
  const adminClient = createSupabaseAdminClient();
  await adminClient.from("site_settings").upsert({ key, value }, { onConflict: "key" });

  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

export async function updateWhyUsFeaturesAction(formData: FormData) {
  const features = [1, 2, 3].map((i) => ({
    icon: String(formData.get(`icon_${i}`) || "").trim() || "Shield",
    title: String(formData.get(`title_${i}`) || "").trim(),
    description: String(formData.get(`description_${i}`) || "").trim()
  }));

  await upsertJsonSetting("why_us_features", features);
}

export async function updateAboutStatsAction(formData: FormData) {
  const stats = [1, 2, 3].map((i) => ({
    label: String(formData.get(`label_${i}`) || "").trim(),
    value: String(formData.get(`value_${i}`) || "").trim()
  }));

  await upsertJsonSetting("about_stats", stats);
}

export async function updateSocialLinksAction(formData: FormData) {
  const links = {
    instagram: String(formData.get("instagram") || "").trim(),
    facebook: String(formData.get("facebook") || "").trim(),
    x: String(formData.get("x") || "").trim()
  };

  await upsertJsonSetting("social_links", links);
}

export async function updateNavbarMenuAction(formData: FormData) {
  const menu = [1, 2, 3, 4]
    .map((i) => ({
      label: String(formData.get(`label_${i}`) || "").trim(),
      href: String(formData.get(`href_${i}`) || "").trim()
    }))
    .filter((item) => item.label && item.href);

  await upsertJsonSetting("navbar_menu_items", menu);
}

export async function updateSeoAction(formData: FormData) {
  const page = String(formData.get("page") || "").trim();
  if (!["home", "cars", "about", "contact"].includes(page)) {
    return;
  }

  const seo = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    keywords: String(formData.get("keywords") || "").trim()
  };

  await upsertJsonSetting(`seo_${page}`, seo);
}
