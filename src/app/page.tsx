import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarClock, Handshake, ShieldCheck, Timer, Wallet } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { getActiveCars } from "@/lib/cars";
import { getSeoFor, getSettings, getString, getWhyUs } from "@/lib/settings";

export async function generateMetadata() {
  const seo = await getSeoFor("home");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords
  };
}

const iconMap: Record<string, ReactNode> = {
  Shield: <ShieldCheck className="text-cyan-400" size={24} />,
  Clock: <Timer className="text-cyan-400" size={24} />,
  Wallet: <Wallet className="text-cyan-400" size={24} />
};

export default async function HomePage() {
  const [settings, cars] = await Promise.all([getSettings(), getActiveCars()]);
  const featured = cars.slice(0, 4);
  const whyUs = getWhyUs(settings);
  const whatsapp = getString(settings, "whatsapp_number");

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden">
        <div className="relative h-[72vh] min-h-[460px]">
          <Image src={getString(settings, "hero_image")} alt="Ana sayfa görseli" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/55 to-cyan-900/40" />
          <div className="container-main relative z-10 flex h-full flex-col justify-center text-white">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">{getString(settings, "hero_title")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-100">{getString(settings, "hero_subtitle")}</p>
            <div className="mt-7 flex gap-3">
              <Link href="/cars" className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Araçları İncele
              </Link>
              <Link
                href={`https://wa.me/${whatsapp}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                WhatsApp ile İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-main mt-14 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <CalendarClock size={20} className="text-cyan-500" />,
              title: "Hızlı Rezervasyon",
              description: "Dakikalar içinde aracınızı ayırtın, vakit kaybetmeden yola çıkın."
            },
            {
              icon: <ShieldCheck size={20} className="text-cyan-500" />,
              title: "Güvenli ve Bakımlı Filo",
              description: "Tüm araçlarımız düzenli bakımdan geçer ve teslimata hazır tutulur."
            },
            {
              icon: <Handshake size={20} className="text-cyan-500" />,
              title: "Şeffaf Hizmet",
              description: "Sürpriz maliyet olmadan, açık ve anlaşılır kiralama süreci sunarız."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">{getString(settings, "featured_title")}</h2>
          <p className="mt-2 text-gray-600">{getString(settings, "featured_subtitle")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} whatsappNumber={whatsapp} />
          ))}
        </div>
        <div className="flex justify-center">
          <Link
            href="/cars"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Daha Fazla Araç
          </Link>
        </div>
      </section>

      <section className="container-main mt-16">
        <h2 className="text-center text-3xl font-bold text-gray-900">{getString(settings, "why_us_title")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {whyUs.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="mb-3">{iconMap[item.icon] ?? <ShieldCheck className="text-cyan-400" size={24} />}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
