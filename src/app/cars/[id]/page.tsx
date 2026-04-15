import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarFront, Fuel, Luggage, Users } from "lucide-react";
import { getCarById } from "@/lib/cars";
import { getSettings, getString } from "@/lib/settings";

type Params = { params: { id: string } };

export default async function CarDetailPage({ params }: Params) {
  const [car, settings] = await Promise.all([getCarById(params.id), getSettings()]);
  if (!car || !car.is_active) {
    notFound();
  }

  const whatsapp = getString(settings, "whatsapp_number");

  return (
    <div className="container-main py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft md:h-[500px]">
          <Image
            src={car.image_url || "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop"}
            alt={car.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="card space-y-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
            <p className="text-gray-500">{car.model_year} modeli</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2"><Users size={16} /> {car.capacity} Kişi</div>
            <div className="flex items-center gap-2"><Luggage size={16} /> {car.luggage} bagaj kapasitesi</div>
            <div className="flex items-center gap-2"><Fuel size={16} /> {car.fuel_type}</div>
            <div className="flex items-center gap-2"><CarFront size={16} /> {car.transmission}</div>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm">
            <p><strong>Günlük:</strong> {Number(car.daily_price).toLocaleString("tr-TR")} TL</p>
            <p><strong>Aylık:</strong> {Number(car.monthly_price).toLocaleString("tr-TR")} TL</p>
            <p><strong>Depozito:</strong> {Number(car.deposit).toLocaleString("tr-TR")} TL</p>
          </div>

          <div className="flex gap-3">
            <Link href="/cars" className="button-muted">Tüm Araçlar</Link>
            <Link
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${car.name} için rezervasyon talep ediyorum.`)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
            >
              WhatsApp ile Rezervasyon Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
