# Premier Home Services — Electrical, HVAC & Plumbing (GTA)

Production-ready Next.js website + admin portal for Premier Home Services, serving the Greater Toronto Area.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- MongoDB + Mongoose
- Auth.js / NextAuth (credentials)
- MongoDB image uploads (Vercel-safe), Resend/Nodemailer (email)
- Framer Motion, GSAP, Lenis animations

## 1. MongoDB Compass setup

1. Ensure MongoDB is running locally (Windows service `MongoDB` or Atlas).
2. Open **MongoDB Compass**.
3. Connect with:

```
mongodb://127.0.0.1:27017
```

4. After seeding, open the database named in your `MONGODB_URI` (e.g. **`phs`** or **`vnec`**) to browse collections (`services`, `pages`, `blogposts`, `leads`, `sitesettings`, etc.).

For Atlas, paste your Atlas URI into `.env.local` as `MONGODB_URI`.

## 2. Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/phs` (Compass/local) or Atlas URI |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Long random string |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin (seed only) |
| `CLOUDINARY_*` | Optional / legacy only (not required) |
| `RESEND_API_KEY` or SMTP_* | Optional email notifications |
| `CONTACT_EMAIL` | `vnecconstruction@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

## 3. Install, seed, run

```bash
npm install
npm run seed
npm run dev
```

- Website: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

Default seed admin (change immediately):

- Email: value of `ADMIN_EMAIL` (example: `admin@phs.local`)
- Password: value of `ADMIN_PASSWORD`

## 4. Scripts

```bash
npm run dev          # development
npm run build        # production build
npm run start        # production server
npm run seed         # upsert settings, pages, services, pricing, blogs, admin
npm run typecheck    # TypeScript
npm run lint         # ESLint
```

## 5. Admin modules

Dashboard · Pages · Services · Pricing · Blogs · Leads · Media Library · Settings

Content edited in admin is stored in MongoDB and revalidated onto the public site (no redeploy needed for content).

## 6. Images

Placeholder Unsplash images ship with seed data. Replace them in **Admin → Media** / page & service editors. Uploads are stored as binaries in MongoDB (`StoredUpload`) and served from `/api/uploads/{folder}/{filename}` — no local disk writes, works on Vercel. Use MongoDB Atlas in production so images persist across deploys.

Logo SVG: `public/logo.svg` (also React component `src/components/brand/Logo.tsx`).

## 7. Business defaults

- Phone: 437-256-1028  
- Email: vnecconstruction@gmail.com  
- Area: Greater Toronto Area, Ontario  
- Hours: Mon–Sat 9:00 AM–5:00 PM · Emergency 24/7  
- Offer: 5% OFF for Seniors, Veterans & First-Time Customers  

## 8. Deploy notes

Set all env vars on your host (Vercel/etc.), point `MONGODB_URI` at Atlas (required for persistent uploads), configure Resend, run `npm run seed` once against production DB, then `npm run build`. Cloudinary is not required.
