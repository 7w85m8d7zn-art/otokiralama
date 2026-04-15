import Image from "next/image";
import Link from "next/link";
import { CarFront, Fuel, Luggage, Users } from "lucide-react";
import type { Car } from "@/lib/types";

type Props = {
  car: Car;
  whatsappNumber: string;
};

export function CarCard({ car, whatsappNumber }: Props) {
  const badgeLabel = car.badge === "Ozel Firsat" ? "Özel Fırsat" : car.badge;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="relative h-56 w-full">
        <Image
          src={car.image_url || "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop"}
          alt={car.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
            <p className="text-sm text-gray-500">{car.model_year} modeli</p>
          </div>
          {badgeLabel && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{badgeLabel}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2"><Users size={16} /> {car.capacity} Kişi</div>
          <div className="flex items-center gap-2"><Luggage size={16} /> {car.luggage} Bagaj</div>
          <div className="flex items-center gap-2"><Fuel size={16} /> {car.fuel_type}</div>
          <div className="flex items-center gap-2"><CarFront size={16} /> {car.transmission}</div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">Günlük: {Number(car.daily_price).toLocaleString("tr-TR")} TL</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">Aylık: {Number(car.monthly_price).toLocaleString("tr-TR")} TL</span>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">Depozito: {Number(car.deposit).toLocaleString("tr-TR")} TL</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/cars/${car.id}`} className="button-muted flex-1">
            Detaylar
          </Link>
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${car.name} için rezervasyon talep ediyorum.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-whatsapp px-5 py-3 text-center text-sm font-semibold text-white"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </article>
  );
}
