# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in the **planning phase** — no source code exists yet. The repository contains only `README.md` and `PRD.md`. All architecture below is the intended design to be implemented.

## What to Build

Alta Immobilier is a real estate platform with two distinct surfaces:
- **Public site**: Browse/filter properties (Apartments, Houses, Villas) by sale/rent, view detail pages with photo galleries
- **Admin dashboard** (`/admin/*`): Protected by JWT, single admin account, full CRUD over listings and photos

## Planned Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT in httpOnly cookie + bcrypt |
| File Storage | AWS S3 (listing photos) |
| Maps | Google Maps API or Mapbox |
| Deployment | Vercel (frontend), Railway (backend) |

## Development Commands

Once implemented, the project uses a monorepo with `client/` and `server/` directories:

```bash
# Backend (from server/)
npm run dev          # Start dev server with hot reload
npm run start        # Start production server
npm run db:migrate   # Run database migrations
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
DATABASE_URL=postgresql://user:password@localhost:5432/altaimmobilier
JWT_SECRET=...
ADMIN_EMAIL=admin@altaimmobilier.com
ADMIN_PASSWORD=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=eu-west-1
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=...
```

## Architecture

### Data Models

Two tables: `listings` (UUID PK, title, category enum, listing_type enum, price, surface_area, rooms, bathrooms, floor nullable, location, description, status enum, timestamps) and `photos` (UUID PK, listing_id FK cascade delete, url S3, is_cover bool, display_order int).

### API Shape

- Public: `GET /api/listings?category=&type=`, `GET /api/listings/:id`
- Auth: `POST /api/auth/login`, `POST /api/auth/logout`
- Admin (JWT required): full CRUD on `/api/admin/listings`, photo upload/delete/patch on `/api/admin/listings/:id/photos` and `/api/admin/photos/:photoId`

### Frontend Routes

- Public: `/`, `/listings`, `/listings/:id`
- Admin: `/admin/login`, `/admin`, `/admin/listings`, `/admin/listings/new`, `/admin/listings/:id/edit`

### Key Behaviors

- Filter state persists in URL query strings (`?category=apartment&type=rent`)
- JWT stored in httpOnly cookie, session expires after 8 hours
- Unauthenticated requests to `/admin/*` redirect to `/admin/login`
- Listings with status `sold_rented` are hidden from public pages but visible in admin table
- Photos: min 1, max 15 per listing; JPG/PNG/WEBP; max 5MB each; first upload is cover by default
- Deleting a listing cascades to all its photos (DB + S3)

## Open Decisions (PRD Section 12)

Before implementing, resolve with the user:
1. Currency display (MAD, EUR, or both)
2. Whether sold/rented listings show publicly with a "Sold" label or are fully hidden
3. URL format: human-readable slugs vs UUID-based IDs
4. Whether listing detail pages need a contact form / WhatsApp link
