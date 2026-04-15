import Image from "next/image";
import { CheckCircle2, Clock3, Headset, ShieldCheck } from "lucide-react";
import { getAboutStats, getSeoFor, getSettings, getString } from "@/lib/settings";

export async function generateMetadata() {
  const seo = await getSeoFor("about");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const stats = getAboutStats(settings);

  return (
    <div className="container-main py-12 space-y-12">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hakkımızda</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Müşteri Odaklı Araç Kiralama Deneyimi</h1>
          <p className="text-gray-700 leading-relaxed">{getString(settings, "about_story")}</p>
          <p className="text-gray-700 leading-relaxed">
            Taşir Oto Kiralama olarak amacımız, müşterilerimizin yolculuklarını daha güvenli, konforlu ve planlı hale getirmek.
            Doğru aracı doğru zamanda sunarak hem bireysel hem kurumsal ihtiyaçlara hızlı çözüm üretiyoruz.
          </p>
        </div>
        <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <Image src={getString(settings, "about_image")} alt="Hakkımızda" fill className="object-cover" />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-4xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Müşterilerimize Ne Sunuyoruz?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <ShieldCheck className="text-cyan-500" />,
              title: "Güvenli Araç Teslimi",
              description: "Periyodik bakımları yapılmış, temiz ve hazır araçlar teslim ediyoruz."
            },
            {
              icon: <Clock3 className="text-cyan-500" />,
              title: "Zaman Kazandıran Süreç",
              description: "Hızlı rezervasyon, hızlı onay ve pratik teslimat ile süreci kolaylaştırıyoruz."
            },
            {
              icon: <Headset className="text-cyan-500" />,
              title: "Sürekli Destek",
              description: "Kiralama öncesi ve sonrası tüm sorularınızda yanınızda oluyoruz."
            }
          ].map((item) => (
            <div key={item.title} className="card">
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-bold text-slate-900">Nasıl Çalışıyoruz?</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            "1. İhtiyacınıza uygun aracı birlikte belirliyoruz.",
            "2. Fiyat ve koşulları açık şekilde paylaşıyoruz.",
            "3. Aracınızı zamanında teslim ederek süreci takip ediyoruz."
          ].map((step) => (
            <div key={step} className="flex items-start gap-2 rounded-xl bg-slate-100 p-3">
              <CheckCircle2 className="mt-0.5 text-cyan-500" size={18} />
              <p className="text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
