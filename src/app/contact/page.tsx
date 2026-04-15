import { ContactForm } from "@/components/contact-form";
import { getSeoFor, getSettings, getString } from "@/lib/settings";

export async function generateMetadata() {
  const seo = await getSeoFor("contact");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords
  };
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-main py-12">
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">İletişim</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Bizimle İletişime Geçin</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Rezervasyon, fiyat teklifi veya diğer sorularınız için formu doldurabilirsiniz. Ekibimiz en kısa sürede size dönüş yapar.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <ContactForm />

        <div className="space-y-5">
          <div className="card text-sm text-slate-700">
            <h2 className="text-xl font-bold text-slate-900">İletişim Bilgileri</h2>
            <div className="mt-4 space-y-3">
              <p><strong>Telefon:</strong> {getString(settings, "contact_phone")}</p>
              <p><strong>E-posta:</strong> {getString(settings, "contact_email")}</p>
              <p><strong>Adres:</strong> {getString(settings, "contact_address")}</p>
              <p><strong>Çalışma Saatleri:</strong> {getString(settings, "working_hours")}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <iframe
              title="Google Maps"
              src={getString(settings, "map_embed_url")}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
