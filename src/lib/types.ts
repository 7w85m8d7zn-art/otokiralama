export type Car = {
  id: string;
  name: string;
  model_year: number;
  fuel_type: "Benzin" | "Dizel" | "LPG" | "Hibrit" | "Elektrik";
  transmission: "Manuel" | "Otomatik";
  capacity: number;
  luggage: number;
  daily_price: number;
  monthly_price: number;
  deposit: number;
  badge: "Ekonomik" | "Prestij" | "Ozel Firsat" | "Özel Fırsat" | null;
  image_url: string | null;
  is_active: boolean;
  is_rented: boolean;
  created_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: unknown;
};

export type SeoSetting = {
  title: string;
  description: string;
  keywords: string;
};

export type WhyUsItem = {
  icon: string;
  title: string;
  description: string;
};

export type AboutStat = {
  label: string;
  value: string;
};

export type NavItem = {
  label: string;
  href: string;
};
