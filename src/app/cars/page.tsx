import { CarsFilterGrid } from "@/components/cars-filter-grid";
import { getActiveCars } from "@/lib/cars";
import { getSeoFor, getSettings, getString } from "@/lib/settings";

export async function generateMetadata() {
  const seo = await getSeoFor("cars");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords
  };
}

export default async function CarsPage() {
  const [cars, settings] = await Promise.all([getActiveCars(), getSettings()]);
  const whatsapp = getString(settings, "whatsapp_number");

  return (
    <div className="container-main py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">Araç Filomuz</h1>
      <p className="mt-2 text-gray-600">Yakıt tipi, vites ve fiyat filtreleriyle istediğiniz aracı bulun.</p>
      <div className="mt-8">
        <CarsFilterGrid cars={cars} whatsappNumber={whatsapp} />
      </div>
    </div>
  );
}
