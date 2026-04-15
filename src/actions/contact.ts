"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli e-posta girin"),
  phone: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı")
});

export async function submitContactAction(
  _prevState: { success: boolean; message: string },
  formData: FormData
) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message || "Form hatalı" };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("contacts").insert(parsed.data);

  if (error) {
    return { success: false, message: "Mesaj gönderilemedi" };
  }

  revalidatePath("/contact");
  return { success: true, message: "Mesajınız başarıyla gönderildi." };
}
