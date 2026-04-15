import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getSettings, getString } from "@/lib/settings";

export async function WhatsAppFloat() {
  const settings = await getSettings();
  const number = getString(settings, "whatsapp_number");
  const href = `https://wa.me/${number}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg"
      aria-label="WhatsApp"
    >
      <MessageCircle size={24} />
    </Link>
  );
}
