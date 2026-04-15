import Link from "next/link";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { loginAction } from "@/actions/admin";

export default function GirisPage({
  searchParams
}: {
  searchParams?: { error?: string | string[] };
}) {
  const error = typeof searchParams?.error === "string" ? searchParams.error : "";

  return (
    <div data-auth-page="true" className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-slate-200 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-cyan-100 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:px-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              <Sparkles size={16} />
              Yönetim Paneli
            </div>
            <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
              Taşir Oto Kiralama
              <span className="block text-slate-700">Yönetici Girişi</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-gray-600">
              İçerik yönetimi, araç güncellemeleri ve rezervasyon taleplerini tek panelden güvenle yönetin.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.10)] md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <LockKeyhole size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Giriş Yap</h2>
              <p className="text-sm text-gray-500">Yalnızca yetkili kullanıcılar içindir.</p>
            </div>
          </div>

          {error && <p className="mb-4 rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-800">{error}</p>}

          <form action={loginAction} className="space-y-3">
            <input name="email" type="email" className="input" placeholder="E-posta adresi" required />
            <input name="password" type="password" className="input" placeholder="Şifre" required />
            <button type="submit" className="button-primary w-full">Giriş Yap</button>
          </form>
        </section>
      </div>
    </div>
  );
}
