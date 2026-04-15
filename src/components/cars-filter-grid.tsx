"use client";

import { useMemo, useState } from "react";
import { CarCard } from "@/components/car-card";
import type { Car } from "@/lib/types";

type Props = {
  cars: Car[];
  whatsappNumber: string;
};

export function CarsFilterGrid({ cars, whatsappNumber }: Props) {
  const [fuel, setFuel] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [priceMax, setPriceMax] = useState<string>("all");

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const fuelMatch = fuel === "all" || car.fuel_type === fuel;
      const transmissionMatch = transmission === "all" || car.transmission === transmission;
      const priceMatch = priceMax === "all" || Number(car.daily_price) <= Number(priceMax);
      return fuelMatch && transmissionMatch && priceMatch;
    });
  }, [cars, fuel, transmission, priceMax]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <select className="input" value={fuel} onChange={(e) => setFuel(e.target.value)}>
          <option value="all">Tüm Yakıt Tipleri</option>
          <option value="Benzin">Benzin</option>
          <option value="Dizel">Dizel</option>
          <option value="LPG">LPG</option>
          <option value="Hibrit">Hibrit</option>
          <option value="Elektrik">Elektrik</option>
        </select>

        <select className="input" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
          <option value="all">Tüm Vitesler</option>
          <option value="Manuel">Manuel</option>
          <option value="Otomatik">Otomatik</option>
        </select>

        <select className="input" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}>
          <option value="all">Tüm Fiyatlar</option>
          <option value="1500">1.500 TL ve altı</option>
          <option value="2500">2.500 TL ve altı</option>
          <option value="3500">3.500 TL ve altı</option>
          <option value="5000">5.000 TL ve altı</option>
        </select>
      </div>

      <p className="text-sm text-gray-600">{filtered.length} araç listeleniyor.</p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((car) => (
          <CarCard key={car.id} car={car} whatsappNumber={whatsappNumber} />
        ))}
      </div>
    </div>
  );
}
