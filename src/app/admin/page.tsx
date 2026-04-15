import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  CarFront,
  ChartNoAxesCombined,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Mail,
  Settings,
  Users
} from "lucide-react";
import {
  deleteCarAction,
  logoutAction,
  saveCarAction,
  updateAboutStatsAction,
  updateNavbarMenuAction,
  updateSettingAction,
  updateSocialLinksAction,
  updateWhyUsFeaturesAction
} from "@/actions/admin";
import { getAllCarsForAdmin } from "@/lib/cars";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSettings, getString } from "@/lib/settings";

type TabKey = "dashboard" | "cars" | "content" | "messages";

const tabs: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "cars", label: "Araç Yönetimi", icon: <CarFront size={16} /> },
  { key: "content", label: "Site İçeriği", icon: <Settings size={16} /> },
  { key: "messages", label: "Mesajlar", icon: <Mail size={16} /> }
];

function SettingForm({
  label,
  settingKey,
  value
}: {
  label: string;
  settingKey: string;
  value: string;
}) {
  return (
    <form action={updateSettingAction} className="space-y-2 rounded-xl border border-gray-200 p-3">
      <input type="hidden" name="key" value={settingKey} />
      <input type="hidden" name="type" value="string" />
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input name="value" defaultValue={value} className="input" />
      <button className="button-primary" type="submit">
        Kaydet
      </button>
    </form>
  );
}

export default async function AdminPage({
  searchParams
}: {
  searchParams?: { error?: string | string[]; tab?: string | string[] };
}) {
  await requireAdmin();

  const requestedTab = typeof searchParams?.tab === "string" ? searchParams.tab : "dashboard";
  const activeTab: TabKey = tabs.some((tab) => tab.key === requestedTab)
    ? (requestedTab as TabKey)
    : "dashboard";

  const supabase = createSupabaseServerClient();
  const [cars, settings, contactsCountResponse, contactsResponse, visitsResponse] = await Promise.all([
    getAllCarsForAdmin(),
    getSettings(),
    supabase.from("contacts").select("*", { count: "exact", head: true }),
    supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("site_visits").select("visitor_id, visited_date")
  ]);

  const contacts = contactsResponse.data || [];
  const totalMessages = contactsCountResponse.count || 0;
  const visits = visitsResponse.data || [];

  const uniqueVisitors = new Set(visits.map((visit) => visit.visitor_id)).size;
  const today = new Date().toISOString().slice(0, 10);
  const todayVisitors = new Set(visits.filter((visit) => visit.visited_date === today).map((visit) => visit.visitor_id)).size;

  const totalCars = cars.length;
  const rentedCars = cars.filter((car) => car.is_rented).length;
  const availableCars = totalCars - rentedCars;
  const inactiveCars = cars.filter((car) => !car.is_active).length;
  const occupancyRate = totalCars > 0 ? Math.round((rentedCars / totalCars) * 100) : 0;

  const error = typeof searchParams?.error === "string" ? searchParams.error : "";

  return (
    <div data-admin-page="true" className="container-main py-10">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:sticky lg:top-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Yönetim Paneli</h1>
          <p className="mt-1 text-xs text-gray-500">Menü</p>

          <nav className="mt-4 space-y-2">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <Link
                  key={tab.key}
                  href={`/admin?tab=${tab.key}`}
                  className={`inline-flex w-full items-center justify-start gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          <form action={logoutAction} className="mt-4">
            <button className="button-muted w-full" type="submit">Çıkış Yap</button>
          </form>
        </aside>

        <main className="space-y-8">
          {error && <p className="rounded-lg bg-amber-100 px-4 py-3 text-sm text-amber-800">{error}</p>}

      {activeTab === "dashboard" && (
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="card space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Toplam Ziyaretçi</p>
              <p className="text-3xl font-extrabold text-gray-900">{uniqueVisitors}</p>
              <p className="text-xs text-gray-500">Bugün: {todayVisitors}</p>
            </div>
            <div className="card space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Toplam Araç</p>
              <p className="text-3xl font-extrabold text-gray-900">{totalCars}</p>
              <p className="text-xs text-gray-500">Pasif: {inactiveCars}</p>
            </div>
            <div className="card space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Kiradaki Araç</p>
              <p className="text-3xl font-extrabold text-gray-900">{rentedCars}</p>
              <p className="text-xs text-gray-500">Müsait: {availableCars}</p>
            </div>
            <div className="card space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Toplam Mesaj</p>
              <p className="text-3xl font-extrabold text-gray-900">{totalMessages}</p>
              <p className="text-xs text-gray-500">İletişim formu kayıtları</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="card">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <ChartNoAxesCombined size={18} className="text-slate-700" />
                Operasyon Özeti
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                  <span className="inline-flex items-center gap-2"><Activity size={16} /> Doluluk Oranı</span>
                  <strong>%{occupancyRate}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                  <span className="inline-flex items-center gap-2"><CarFront size={16} /> Müsait Araç</span>
                  <strong>{availableCars}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                  <span className="inline-flex items-center gap-2"><Users size={16} /> Toplam Ziyaretçi</span>
                  <strong>{uniqueVisitors}</strong>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                  <span className="inline-flex items-center gap-2"><CircleDollarSign size={16} /> Kiradaki Araç</span>
                  <strong>{rentedCars}</strong>
                </div>
              </div>
            </article>

            <article className="card">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FileText size={18} className="text-slate-700" />
                Son Mesajlar
              </h3>
              <div className="space-y-3">
                {contacts.slice(0, 5).map((message) => (
                  <div key={message.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">{message.name}</p>
                      <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{message.email}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-700">{message.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && <p className="text-sm text-gray-500">Henüz mesaj yok.</p>}
              </div>
            </article>
          </div>
        </section>
      )}

      {activeTab === "cars" && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Araç Yönetimi</h2>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Toplam Araç</p>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">{totalCars}</p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Kiradaki</p>
              <p className="mt-2 text-2xl font-extrabold text-amber-700">{rentedCars}</p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Müsait</p>
              <p className="mt-2 text-2xl font-extrabold text-teal-700">{availableCars}</p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pasif</p>
              <p className="mt-2 text-2xl font-extrabold text-gray-700">{inactiveCars}</p>
            </div>
          </div>

          <details className="card" open>
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">
              Yeni Araç Ekle
            </summary>
            <form action={saveCarAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4" encType="multipart/form-data">
              <input name="id" className="input" placeholder="ID (düzenleme için opsiyonel)" />
              <input name="name" className="input" placeholder="Araç adı" required />
              <input name="model_year" type="number" className="input" placeholder="Model yılı" required />

              <select name="fuel_type" className="input" defaultValue="Benzin">
                <option>Benzin</option>
                <option>Dizel</option>
                <option>LPG</option>
                <option>Hibrit</option>
                <option>Elektrik</option>
              </select>

              <select name="transmission" className="input" defaultValue="Manuel">
                <option>Manuel</option>
                <option>Otomatik</option>
              </select>

              <input name="capacity" type="number" className="input" placeholder="Kapasite" required />
              <input name="luggage" type="number" className="input" placeholder="Bagaj" required />
              <input name="daily_price" type="number" className="input" placeholder="Günlük fiyat" required />
              <input name="monthly_price" type="number" className="input" placeholder="Aylık fiyat" required />
              <input name="deposit" type="number" className="input" placeholder="Depozito" required />

              <select name="badge" className="input" defaultValue="">
                <option value="">Rozet Yok</option>
                <option>Ekonomik</option>
                <option>Prestij</option>
                <option value="Ozel Firsat">Özel Fırsat</option>
              </select>

              <input name="image_url" className="input" placeholder="Görsel URL (opsiyonel)" />
              <input name="image_file" type="file" accept="image/*" className="input" />

              <label className="flex items-center gap-2 text-sm">
                <input name="is_active" type="checkbox" defaultChecked /> Aktif
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input name="is_rented" type="checkbox" /> Kirada
              </label>

              <button type="submit" className="button-primary">Araç Kaydet</button>
            </form>
          </details>

          <div className="space-y-3">
            {cars.map((car) => (
              <details key={car.id} className="card">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{car.name}</p>
                      <p className="text-xs text-gray-500">
                        {car.model_year} • {car.fuel_type} • {car.transmission} • Günlük {Number(car.daily_price).toLocaleString("tr-TR")} TL
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          car.is_rented ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {car.is_rented ? "Kirada" : "Müsait"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          car.is_active ? "bg-slate-200 text-slate-700" : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {car.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  </div>
                </summary>

                <div className="mt-4 grid gap-3 md:grid-cols-5">
                  <p className="col-span-full text-xs text-gray-500">{car.id}</p>
                  <form action={saveCarAction} className="col-span-full grid gap-2 md:grid-cols-2" encType="multipart/form-data">
                    <input type="hidden" name="id" value={car.id} />
                    <input name="name" className="input" defaultValue={car.name} required />
                    <input name="model_year" type="number" className="input" defaultValue={car.model_year} required />
                    <input name="capacity" type="number" className="input" defaultValue={car.capacity} required />
                    <input name="luggage" type="number" className="input" defaultValue={car.luggage} required />
                    <input name="daily_price" type="number" className="input" defaultValue={Number(car.daily_price)} required />
                    <input name="monthly_price" type="number" className="input" defaultValue={Number(car.monthly_price)} required />
                    <input name="deposit" type="number" className="input" defaultValue={Number(car.deposit)} required />
                    <select name="fuel_type" className="input" defaultValue={car.fuel_type}>
                      <option>Benzin</option><option>Dizel</option><option>LPG</option><option>Hibrit</option><option>Elektrik</option>
                    </select>
                    <select name="transmission" className="input" defaultValue={car.transmission}>
                      <option>Manuel</option><option>Otomatik</option>
                    </select>
                    <select name="badge" className="input" defaultValue={car.badge || ""}>
                      <option value="">Rozet Yok</option><option>Ekonomik</option><option>Prestij</option><option value="Ozel Firsat">Özel Fırsat</option>
                    </select>
                    <input name="image_url" className="input" defaultValue={car.image_url || ""} placeholder="Görsel URL" />
                    <input name="image_file" type="file" accept="image/*" className="input" />
                    <div className="col-span-full flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input name="is_active" type="checkbox" defaultChecked={car.is_active} /> Aktif
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input name="is_rented" type="checkbox" defaultChecked={car.is_rented} /> Kirada
                      </label>
                    </div>
                    <div className="col-span-full flex flex-wrap gap-3">
                      <button className="button-primary" type="submit">Güncelle</button>
                    </div>
                  </form>
                  <form action={deleteCarAction}>
                    <input type="hidden" name="id" value={car.id} />
                    <button className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900" type="submit">
                      Aracı Sil
                    </button>
                  </form>
                </div>
              </details>
            ))}
            {cars.length === 0 && <p className="text-sm text-gray-500">Henüz araç kaydı bulunmuyor.</p>}
          </div>
        </section>
      )}

      {activeTab === "content" && (
        <section className="space-y-4">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900">Site İçeriği</h2>
            <p className="mt-2 text-sm text-gray-600">
              Alanlar sayfa bazlı gruplandı. Her değişiklikten sonra “Kaydet” butonuna basmanız yeterli.
            </p>
          </div>

          <details className="card" open>
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">Genel Ayarlar</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SettingForm label="WhatsApp Numarası" settingKey="whatsapp_number" value={getString(settings, "whatsapp_number")} />
              <SettingForm label="Duyuru Metni" settingKey="announcement_text" value={getString(settings, "announcement_text")} />
              <SettingForm label="Duyuru Rengi (HEX)" settingKey="announcement_color" value={getString(settings, "announcement_color")} />
              <SettingForm label="Navbar Logo" settingKey="navbar_logo" value={getString(settings, "navbar_logo")} />
              <SettingForm label="Footer Logo" settingKey="footer_logo" value={getString(settings, "footer_logo")} />
              <SettingForm label="Footer Açıklama" settingKey="footer_description" value={getString(settings, "footer_description")} />
            </div>
          </details>

          <details className="card">
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">Ana Sayfa</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SettingForm label="Hero Başlık" settingKey="hero_title" value={getString(settings, "hero_title")} />
              <SettingForm label="Hero Alt Başlık" settingKey="hero_subtitle" value={getString(settings, "hero_subtitle")} />
              <SettingForm label="Hero Görsel URL" settingKey="hero_image" value={getString(settings, "hero_image")} />
              <SettingForm label="Öne Çıkan Başlık" settingKey="featured_title" value={getString(settings, "featured_title")} />
              <SettingForm label="Öne Çıkan Açıklama" settingKey="featured_subtitle" value={getString(settings, "featured_subtitle")} />
              <SettingForm label="Neden Biz Başlık" settingKey="why_us_title" value={getString(settings, "why_us_title")} />
            </div>
            <div className="mt-5 rounded-xl border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900">Neden Biz Kartları</h3>
              <form action={updateWhyUsFeaturesAction} className="mt-3 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => {
                  const i = index + 1;
                  const source = Array.isArray(settings.why_us_features) ? settings.why_us_features[index] : undefined;
                  const obj = (source ?? {}) as { icon?: string; title?: string; description?: string };
                  return (
                    <div key={i} className="grid gap-2 rounded-lg border border-gray-200 p-3 md:grid-cols-3">
                      <input className="input" name={`icon_${i}`} defaultValue={obj.icon || "Shield"} placeholder="İkon (Shield/Clock/Wallet)" />
                      <input className="input" name={`title_${i}`} defaultValue={obj.title || ""} placeholder={`Kart ${i} Başlığı`} />
                      <input className="input" name={`description_${i}`} defaultValue={obj.description || ""} placeholder={`Kart ${i} Açıklaması`} />
                    </div>
                  );
                })}
                <button className="button-primary" type="submit">Neden Biz Kartlarını Kaydet</button>
              </form>
            </div>
          </details>

          <details className="card">
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">Hakkımızda Sayfası</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SettingForm label="Hakkımızda Hikâye" settingKey="about_story" value={getString(settings, "about_story")} />
              <SettingForm label="Hakkımızda Görsel" settingKey="about_image" value={getString(settings, "about_image")} />
            </div>
            <div className="mt-5 rounded-xl border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900">Hakkımızda İstatistikleri</h3>
              <form action={updateAboutStatsAction} className="mt-3 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => {
                  const i = index + 1;
                  const source = Array.isArray(settings.about_stats) ? settings.about_stats[index] : undefined;
                  const obj = (source ?? {}) as { label?: string; value?: string };
                  return (
                    <div key={i} className="grid gap-2 rounded-lg border border-gray-200 p-3 md:grid-cols-2">
                      <input className="input" name={`label_${i}`} defaultValue={obj.label || ""} placeholder={`İstatistik ${i} Etiket`} />
                      <input className="input" name={`value_${i}`} defaultValue={obj.value || ""} placeholder={`İstatistik ${i} Değer`} />
                    </div>
                  );
                })}
                <button className="button-primary" type="submit">İstatistikleri Kaydet</button>
              </form>
            </div>
          </details>

          <details className="card">
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">İletişim Sayfası</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <SettingForm label="Telefon" settingKey="contact_phone" value={getString(settings, "contact_phone")} />
              <SettingForm label="E-posta" settingKey="contact_email" value={getString(settings, "contact_email")} />
              <SettingForm label="Adres" settingKey="contact_address" value={getString(settings, "contact_address")} />
              <SettingForm label="Çalışma Saatleri" settingKey="working_hours" value={getString(settings, "working_hours")} />
              <SettingForm label="Google Maps Embed URL" settingKey="map_embed_url" value={getString(settings, "map_embed_url")} />
            </div>
          </details>

          <details className="card">
            <summary className="cursor-pointer list-none text-lg font-bold text-gray-900">Menü ve Sosyal Linkler</summary>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900">Navbar Menü Öğeleri</h3>
                <form action={updateNavbarMenuAction} className="mt-3 space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const i = index + 1;
                    const source = Array.isArray(settings.navbar_menu_items) ? settings.navbar_menu_items[index] : undefined;
                    const obj = (source ?? {}) as { label?: string; href?: string };
                    return (
                      <div key={i} className="grid gap-2 md:grid-cols-2">
                        <input className="input" name={`label_${i}`} defaultValue={obj.label || ""} placeholder={`Menü ${i} Başlık`} />
                        <input className="input" name={`href_${i}`} defaultValue={obj.href || ""} placeholder={`Menü ${i} Link`} />
                      </div>
                    );
                  })}
                  <button className="button-primary" type="submit">Menüyü Kaydet</button>
                </form>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900">Sosyal Linkler</h3>
                <form action={updateSocialLinksAction} className="mt-3 space-y-2">
                  {(() => {
                    const social = (settings.social_links ?? {}) as Record<string, string>;
                    return (
                      <>
                        <input className="input" name="instagram" defaultValue={social.instagram || ""} placeholder="Instagram URL" />
                        <input className="input" name="facebook" defaultValue={social.facebook || ""} placeholder="Facebook URL" />
                        <input className="input" name="x" defaultValue={social.x || ""} placeholder="X (Twitter) URL" />
                      </>
                    );
                  })()}
                  <button className="button-primary" type="submit">Sosyal Linkleri Kaydet</button>
                </form>
              </div>
            </div>
          </details>

        </section>
      )}

      {activeTab === "messages" && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">İletişim Mesajları</h2>
          <div className="space-y-3">
            {contacts.map((message) => (
              <article key={message.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{message.name}</h3>
                  <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString("tr-TR")}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{message.email} {message.phone ? `| ${message.phone}` : ""}</p>
                <p className="mt-3 text-sm text-gray-700">{message.message}</p>
              </article>
            ))}
            {contacts.length === 0 && <p className="text-sm text-gray-500">Henüz mesaj yok.</p>}
          </div>
        </section>
      )}
        </main>
      </div>
    </div>
  );
}
