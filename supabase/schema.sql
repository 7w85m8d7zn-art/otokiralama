-- Enable extensions
create extension if not exists "pgcrypto";

-- Cars
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model_year int not null,
  fuel_type text not null check (fuel_type in ('Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik')),
  transmission text not null check (transmission in ('Manuel', 'Otomatik')),
  capacity int not null,
  luggage int not null,
  daily_price numeric(10,2) not null,
  monthly_price numeric(10,2) not null,
  deposit numeric(10,2) not null,
  badge text check (badge in ('Ekonomik', 'Prestij', 'Ozel Firsat', 'Özel Fırsat')),
  image_url text,
  is_active boolean not null default true,
  is_rented boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.cars
add column if not exists is_rented boolean not null default false;

-- Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Site settings as editable key-value JSON
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  visited_date date not null default current_date,
  visited_at timestamptz not null default now(),
  unique (visitor_id, visited_date)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

-- RLS
alter table public.cars enable row level security;
alter table public.contacts enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_visits enable row level security;

-- Public can read active cars
drop policy if exists "Public can read active cars" on public.cars;
create policy "Public can read active cars"
on public.cars
for select
using (is_active = true);

-- Public can insert contact messages
drop policy if exists "Public can insert contacts" on public.contacts;
create policy "Public can insert contacts"
on public.contacts
for insert
with check (true);

-- Authenticated users can read contacts (admin panel)
drop policy if exists "Authenticated can read contacts" on public.contacts;
create policy "Authenticated can read contacts"
on public.contacts
for select
using (auth.role() = 'authenticated');

-- Public can read site settings
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
using (true);

-- Authenticated can manage cars and settings
drop policy if exists "Authenticated can manage cars" on public.cars;
create policy "Authenticated can manage cars"
on public.cars
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can manage settings" on public.site_settings;
create policy "Authenticated can manage settings"
on public.site_settings
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can read site visits" on public.site_visits;
create policy "Authenticated can read site visits"
on public.site_visits
for select
using (auth.role() = 'authenticated');

drop policy if exists "Public can insert site visits" on public.site_visits;
create policy "Public can insert site visits"
on public.site_visits
for insert
with check (true);

-- Storage bucket for car images
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

-- Public read policy for car images
drop policy if exists "Public can view car images" on storage.objects;
create policy "Public can view car images"
on storage.objects
for select
using (bucket_id = 'car-images');

-- Authenticated can upload/update/delete car images
drop policy if exists "Authenticated can manage car images" on storage.objects;
create policy "Authenticated can manage car images"
on storage.objects
for all
using (bucket_id = 'car-images' and auth.role() = 'authenticated')
with check (bucket_id = 'car-images' and auth.role() = 'authenticated');

-- Seed default site settings
insert into public.site_settings (key, value)
values
  ('hero_title', to_jsonb('Taşir Oto Kiralama'::text)),
  ('hero_subtitle', to_jsonb('İhtiyacınıza uygun aracı dakikalar içinde kiralayın.'::text)),
  ('hero_image', to_jsonb('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop'::text)),
  ('featured_title', to_jsonb('Öne Çıkan Araçlar'::text)),
  ('featured_subtitle', to_jsonb('Kaliteli, bakımlı ve ekonomik seçenekler'::text)),
  ('why_us_title', to_jsonb('Neden Bizi Seçmelisiniz?'::text)),
  ('why_us_features', '[{"icon":"Shield","title":"Güvenli Sürüş","description":"Tüm araçlarımız periyodik bakımdan geçer."},{"icon":"Clock","title":"7/24 Destek","description":"Yol yardım ve müşteri desteği her zaman sizinle."},{"icon":"Wallet","title":"Şeffaf Fiyat","description":"Gizli ücret olmadan net fiyatlandırma."}]'::jsonb),
  ('about_story', to_jsonb('Taşir Oto Kiralama olarak yıllardır güvenli ve konforlu ulaşım deneyimi sunuyoruz.'::text)),
  ('about_image', to_jsonb('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop'::text)),
  ('about_stats', '[{"label":"Araç","value":"500+"},{"label":"Mutlu Müşteri","value":"10000+"},{"label":"Lokasyon","value":"50+"}]'::jsonb),
  ('contact_phone', to_jsonb('+90 555 123 45 67'::text)),
  ('contact_email', to_jsonb('info@tasiroto.com'::text)),
  ('contact_address', to_jsonb('İstanbul, Türkiye'::text)),
  ('working_hours', to_jsonb('Her gün 08:00 - 22:00'::text)),
  ('map_embed_url', to_jsonb('https://www.google.com/maps?q=Istanbul&output=embed'::text)),
  ('footer_logo', to_jsonb('Taşir Oto Kiralama'::text)),
  ('footer_description', to_jsonb('Konforlu ve güvenli araç kiralama deneyimi.'::text)),
  ('social_links', '{"instagram":"https://instagram.com","facebook":"https://facebook.com","x":"https://x.com"}'::jsonb),
  ('navbar_logo', to_jsonb('Taşir Oto Kiralama'::text)),
  ('navbar_menu_items', '[{"label":"Ana Sayfa","href":"/"},{"label":"Araçlar","href":"/cars"},{"label":"Hakkımızda","href":"/about"},{"label":"İletişim","href":"/contact"}]'::jsonb),
  ('whatsapp_number', to_jsonb('905551234567'::text)),
  ('announcement_text', to_jsonb('Erken rezervasyonda %15 indirim!'::text)),
  ('announcement_color', to_jsonb('#0F172A'::text)),
  ('seo_home', '{"title":"Taşir Oto Kiralama | Ana Sayfa","description":"Güvenilir ve ekonomik araç kiralama hizmeti","keywords":"araç kiralama, oto kiralama, istanbul"}'::jsonb),
  ('seo_cars', '{"title":"Araçlar | Taşir Oto Kiralama","description":"Tüm araç filomuzu inceleyin","keywords":"kiralık araçlar, ekonomik araç"}'::jsonb),
  ('seo_about', '{"title":"Hakkımızda | Taşir Oto Kiralama","description":"Şirket hikâyemiz ve değerlerimiz","keywords":"hakkımızda, oto kiralama"}'::jsonb),
  ('seo_contact', '{"title":"İletişim | Taşir Oto Kiralama","description":"Bize ulaşın","keywords":"iletişim, taşir oto"}'::jsonb)
on conflict (key) do nothing;

-- Optional sample cars
insert into public.cars (
  name, model_year, fuel_type, transmission, capacity, luggage, daily_price, monthly_price, deposit, badge, image_url, is_active, is_rented
)
values
  ('Renault Clio', 2023, 'Benzin', 'Manuel', 5, 2, 1200, 30000, 5000, 'Ekonomik', 'https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1200&auto=format&fit=crop', true, false),
  ('Fiat Egea', 2024, 'Dizel', 'Manuel', 5, 3, 1400, 35000, 6000, 'Ekonomik', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop', true, true),
  ('Toyota Corolla', 2023, 'Hibrit', 'Otomatik', 5, 3, 1800, 45000, 9000, 'Prestij', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop', true, false),
  ('BMW 3 Serisi', 2022, 'Benzin', 'Otomatik', 5, 4, 3500, 90000, 20000, 'Ozel Firsat', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop', true, true)
on conflict do nothing;
