# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Frontend is scaffolded. Backend (`server/`) is next to be built.

## What to Build

Alta Immobilier is a real estate platform with two distinct surfaces:
- **Public site**: Browse/filter properties (Apartments, Houses, Villas) by sale/rent, view detail pages with photo galleries
- **Admin dashboard** (`/admin/*`): Protected by JWT, single admin account, full CRUD over listings and photos

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT in httpOnly cookie + bcrypt |
| File Storage | Cloudinary (listing photos) |
| Maps | Google Maps API or Mapbox |
| Deployment | Vercel (frontend), Railway (backend) |

## Development Commands

Monorepo with `client/` and `server/` directories:

```bash
# Backend (from server/)
npm run dev          # Start dev server with hot reload
npm run start        # Start production server
npm run db:seed      # Seed sample listings

# Frontend (from client/)
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build locally
```

## Environment Variables

**`server/.env`**
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_EMAIL=admin@altaimmobilier.com
ADMIN_PASSWORD=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=...
VITE_WHATSAPP_NUMBER=212662018283
```

## Architecture

### Data Models

**Listing** (Mongoose): slug (unique), title, category (enum: apartment|house|villa), listing_type (enum: sale|rent), price_mad, price_eur, surface_area, rooms, bathrooms, floor (nullable), location, description, status (enum: available|sold_rented), photos (embedded array: url, public_id, is_cover, display_order), timestamps.

**No separate photos collection** — photos are embedded in the listing document. Deleting a listing deletes its Cloudinary images automatically.

### Slug Generation

Auto-generated from title on create (e.g. "Villa Moderne Marrakech" → `villa-moderne-marrakech`). Append `-2`, `-3` etc. if duplicate.

### API Shape

- Public: `GET /api/listings?category=&type=`, `GET /api/listings/:slug`
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`
- Admin (JWT required): full CRUD on `/api/admin/listings`, photo upload/delete/patch on `/api/admin/listings/:id/photos` and `/api/admin/photos/:photoId`

### Frontend Routes

- Public: `/`, `/listings`, `/listings/:slug`
- Admin: `/admin/login`, `/admin`, `/admin/listings`, `/admin/listings/new`, `/admin/listings/:id/edit`

### Key Behaviors

- Filter state persists in URL query strings (`?category=apartment&type=rent`)
- JWT stored in httpOnly cookie, session expires after 8 hours
- Unauthenticated requests to `/admin/*` redirect to `/admin/login`
- Listings with status `sold_rented` are visible publicly with a "Vendu" / "Loué" badge — no WhatsApp button shown
- Photos: min 1, max 15 per listing; JPG/PNG/WEBP; max 5MB each; first upload is cover by default
- Deleting a listing cascades to all its Cloudinary photos
- Currency: display both MAD and EUR (fixed rate: 1 EUR = 10.8 MAD)
- Contact: WhatsApp button linking to +212662018283 with pre-filled message (hidden on sold/rented listings)

## Resolved Decisions

| Decision | Choice |
|---|---|
| Currency | Both MAD + EUR |
| Sold/Rented listings | Visible with badge, WhatsApp button hidden |
| URL format | Human-readable slugs |
| Contact | WhatsApp button (+212662018283) |
