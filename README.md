# Taşir Oto Kiralama

Next.js 14 + Supabase + Tailwind CSS + TypeScript car rental website.

## 1. Environment

Copy `.env.example` to `.env.local` and fill:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2. Supabase Setup

1. Create a Supabase project.
2. Run SQL in `supabase/schema.sql` from the SQL editor.
3. In Supabase Authentication, create an admin user (email/password).

## 3. Run

```bash
npm install
npm run dev
```

## Routes

- `/` Homepage
- `/cars` Cars list with client-side filtering
- `/cars/[id]` Car detail
- `/about` About
- `/contact` Contact + form
- `/giris` Yönetici giriş ekranı
- `/admin` Protected admin panel

## Admin Capabilities

- Car CRUD (add/edit/delete)
- Car image upload to Supabase Storage (`car-images` bucket)
- Car specs/pricing/badges/visibility managementadm
- Full site content management via `site_settings`
- WhatsApp number and announcement bar management
- SEO settings per page
- Contact messages listing
# otokiralama
