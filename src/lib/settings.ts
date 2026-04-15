import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AboutStat, NavItem, SeoSetting, SiteSettingRow, WhyUsItem } from "@/lib/types";

const defaultSettings: Record<string, unknown> = {
  hero_title: "Taşir Oto Kiralama",
  hero_subtitle: "İhtiyacınıza uygun aracı dakikalar içinde kiralayın.",
  hero_image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
  featured_title: "Öne Çıkan Araçlar",
  featured_subtitle: "Kaliteli, bakımlı ve ekonomik seçenekler",
  why_us_title: "Neden Bizi Seçmelisiniz?",
  why_us_features: [
    { icon: "Shield", title: "Güvenli Sürüş", description: "Tüm araçlarımız periyodik bakımdan geçer." },
    { icon: "Clock", title: "7/24 Destek", description: "Yol yardım ve müşteri desteği her zaman sizinle." },
    { icon: "Wallet", title: "Şeffaf Fiyat", description: "Gizli ücret olmadan net fiyatlandırma." }
  ],
  about_story: "Taşir Oto Kiralama olarak yıllardır güvenli ve konforlu ulaşım deneyimi sunuyoruz.",
  about_image:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
  about_stats: [
    { label: "Araç", value: "500+" },
    { label: "Mutlu Müşteri", value: "10000+" },
    { label: "Konum", value: "50+" }
  ],
  contact_phone: "+90 555 123 45 67",
  contact_email: "info@tasiroto.com",
  contact_address: "İstanbul, Türkiye",
  working_hours: "Her gün 08:00 - 22:00",
  map_embed_url: "https://www.google.com/maps?q=Istanbul&output=embed",
  footer_logo: "Taşir Oto Kiralama",
  footer_description: "Konforlu ve güvenli araç kiralama deneyimi.",
  social_links: { instagram: "https://instagram.com", facebook: "https://facebook.com", x: "https://x.com" },
  navbar_logo: "Taşir Oto Kiralama",
  navbar_menu_items: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Araçlar", href: "/cars" },
    { label: "Hakkımızda", href: "/about" },
    { label: "İletişim", href: "/contact" }
  ],
  whatsapp_number: "905551234567",
  announcement_text: "Erken rezervasyonda %15 indirim!",
  announcement_color: "#0F172A",
  seo_home: {
    title: "Taşir Oto Kiralama | Ana Sayfa",
    description: "Güvenilir ve ekonomik araç kiralama hizmeti",
    keywords: "araç kiralama, oto kiralama, İstanbul"
  },
  seo_cars: {
    title: "Araçlar | Taşir Oto Kiralama",
    description: "Tüm araç filomuzu inceleyin",
    keywords: "kiralık araçlar, ekonomik araç"
  },
  seo_about: {
    title: "Hakkımızda | Taşir Oto Kiralama",
    description: "Şirket hikâyemiz ve değerlerimiz",
    keywords: "hakkımızda, oto kiralama"
  },
  seo_contact: {
    title: "İletişim | Taşir Oto Kiralama",
    description: "Bize ulaşın",
    keywords: "iletişim, taşir oto"
  }
};

const textReplacements: Array<[RegExp, string]> = [
  [/\bIletisim\b/g, "İletişim"],
  [/\bHakkimizda\b/g, "Hakkımızda"],
  [/\bArac\b/g, "Araç"],
  [/\bAraclar\b/g, "Araçlar"],
  [/\barac\b/g, "araç"],
  [/\baraclar\b/g, "araçlar"],
  [/\bGiris\b/g, "Giriş"],
  [/\bgiris\b/g, "giriş"],
  [/\bMusteri\b/g, "Müşteri"],
  [/\bmusteri\b/g, "müşteri"],
  [/\bGuven\b/g, "Güven"],
  [/\bguven\b/g, "güven"],
  [/\bSeffaf\b/g, "Şeffaf"],
  [/\bseffaf\b/g, "şeffaf"],
  [/\bOzel\b/g, "Özel"],
  [/\bozel\b/g, "özel"],
  [/\bFirsat\b/g, "Fırsat"],
  [/\bfirsat\b/g, "fırsat"],
  [/\bOne Cikan\b/g, "Öne Çıkan"],
  [/\bone cikan\b/g, "öne çıkan"],
  [/\bSecmelisiniz\b/g, "Seçmelisiniz"],
  [/\bsecmelisiniz\b/g, "seçmelisiniz"],
  [/\bIhtiyaciniza\b/g, "İhtiyacınıza"],
  [/\bihtiyaciniza\b/g, "ihtiyacınıza"],
  [/\bTurkiye\b/g, "Türkiye"],
  [/\bturkiye\b/g, "türkiye"],
  [/\bSirket\b/g, "Şirket"],
  [/\bsirket\b/g, "şirket"],
  [/\bhikayemiz\b/g, "hikâyemiz"],
  [/\bdegerlerimiz\b/g, "değerlerimiz"],
  [/\byillardir\b/g, "yıllardır"],
  [/\bulas[iı]m\b/g, "ulaşım"],
  [/\bulas[iı]n\b/g, "ulaşın"],
  [/\biletisim\b/g, "iletişim"],
  [/\btasir oto\b/g, "taşir oto"]
];

function normalizeTurkishText(value: string) {
  return textReplacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), value);
}

const nonTextSettingKeys = new Set([
  "hero_image",
  "about_image",
  "map_embed_url",
  "contact_email",
  "contact_phone",
  "whatsapp_number",
  "announcement_color"
]);

export async function getSettings() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error || !data) {
    return defaultSettings;
  }

  return data.reduce((acc, row: SiteSettingRow) => {
    acc[row.key] = row.value;
    return acc;
  }, { ...defaultSettings } as Record<string, unknown>);
}

export async function getSeoFor(page: "home" | "cars" | "about" | "contact"): Promise<SeoSetting> {
  const settings = await getSettings();
  const setting = settings[`seo_${page}`] as SeoSetting | undefined;
  const fallback = defaultSettings[`seo_${page}`] as SeoSetting;

  return {
    title: normalizeTurkishText(setting?.title ?? fallback.title),
    description: normalizeTurkishText(setting?.description ?? fallback.description),
    keywords: normalizeTurkishText(setting?.keywords ?? fallback.keywords)
  };
}

export function getString(settings: Record<string, unknown>, key: string) {
  const value = settings[key];
  const rawValue = typeof value === "string" ? value : String(defaultSettings[key] ?? "");

  return nonTextSettingKeys.has(key) ? rawValue : normalizeTurkishText(rawValue);
}

export function getWhyUs(settings: Record<string, unknown>) {
  const value = settings.why_us_features;
  const source = Array.isArray(value) ? (value as WhyUsItem[]) : (defaultSettings.why_us_features as WhyUsItem[]);
  return source.map((item) => ({
    ...item,
    title: normalizeTurkishText(String(item.title || "")),
    description: normalizeTurkishText(String(item.description || ""))
  }));
}

export function getAboutStats(settings: Record<string, unknown>) {
  const value = settings.about_stats;
  const source = Array.isArray(value) ? (value as AboutStat[]) : (defaultSettings.about_stats as AboutStat[]);
  return source.map((item) => ({
    ...item,
    label: normalizeTurkishText(String(item.label || "")),
    value: String(item.value || "")
  }));
}

export function getNavItems(settings: Record<string, unknown>) {
  const value = settings.navbar_menu_items;
  const source = Array.isArray(value) ? (value as NavItem[]) : (defaultSettings.navbar_menu_items as NavItem[]);
  return source.map((item) => ({
    ...item,
    label: normalizeTurkishText(String(item.label || "")),
    href: String(item.href || "")
  }));
}
