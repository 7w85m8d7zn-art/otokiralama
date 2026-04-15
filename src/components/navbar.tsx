import Link from "next/link";
import { getNavItems, getSettings, getString } from "@/lib/settings";

export async function Navbar() {
  const settings = await getSettings();
  const logo = getString(settings, "navbar_logo");
  const items = getNavItems(settings);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-extrabold text-slate-900">
          {logo}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
          {items.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
