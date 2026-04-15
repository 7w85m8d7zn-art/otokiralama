import Link from "next/link";
import { getSettings, getString } from "@/lib/settings";

export async function Footer() {
  const settings = await getSettings();
  const logo = getString(settings, "footer_logo");
  const description = getString(settings, "footer_description");
  const social = (settings.social_links ?? {}) as Record<string, string>;

  return (
    <footer className="mt-12 border-t border-slate-700/60 bg-footer text-gray-200">
      <div className="container-main grid gap-6 py-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-white">{logo}</h3>
          <p className="mt-2 text-sm text-gray-300">{description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Hızlı Bağlantılar</h4>
          <div className="mt-2 flex flex-col gap-1.5 text-sm">
            <Link href="/">Ana Sayfa</Link>
            <Link href="/cars">Araçlar</Link>
            <Link href="/about">Hakkımızda</Link>
            <Link href="/contact">İletişim</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Sosyal Medya</h4>
          <div className="mt-2 flex flex-col gap-1.5 text-sm">
            {Object.entries(social).map(([key, value]) => (
              <a key={key} href={value} target="_blank" rel="noreferrer" className="capitalize hover:text-white">
                {key}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
