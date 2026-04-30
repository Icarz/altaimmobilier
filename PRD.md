# Altaimmobiler — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-04-29  
**Author:**  Icarus & Co

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [Scope](#4-scope)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 [Visitor — Browse & Search](#51-visitor--browse--search)
   - 5.2 [Admin — Authentication](#52-admin--authentication)
   - 5.3 [Admin — Dashboard Overview](#53-admin--dashboard-overview)
   - 5.4 [Admin — Add New Listing](#54-admin--add-new-listing)
   - 5.5 [Admin — Edit Listing](#55-admin--edit-listing)
   - 5.6 [Admin — Photo Management](#56-admin--photo-management)
   - 5.7 [Admin — Delete / Archive Listing](#57-admin--delete--archive-listing)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Models](#7-data-models)
8. [API Endpoints](#8-api-endpoints)
9. [Page Map & Routes](#9-page-map--routes)
10. [UI/UX Requirements](#10-uiux-requirements)
11. [Out of Scope](#11-out-of-scope)
12. [Open Questions](#12-open-questions)

---

## 1. Executive Summary

Altaimmobilier is a real estate web platform with two distinct experiences:

- **Visitors** can browse a catalog of properties organized by category (Apartments, Houses, Villas), filter by listing type (For Sale / For Rent), and view detailed property pages.
- **The Admin** manages the full property catalog through a secure dashboard — adding new establishments, updating listing information, adjusting prices, and managing photos.

The platform is designed to be clean, fast, and easy to use, without requiring visitor registration.

---

## 2. Goals & Success Metrics

### Goals

- Enable visitors to discover properties quickly through category-based browsing and filtering.
- Give the admin full control over the property catalog through a simple, dedicated dashboard.
- Ensure listings always reflect accurate, up-to-date information (prices, photos, availability).

### Success Metrics

| Metric                              | Target              |
|-------------------------------------|---------------------|
| Time to find a relevant listing     | < 30 seconds        |
| Admin time to publish a new listing | < 5 minutes         |
| Admin time to update a price/photo  | < 2 minutes         |
| Mobile usability score (Lighthouse) | ≥ 90                |
| Page load time (largest listing page)| < 2.5 seconds      |

---

## 3. User Personas

### Persona 1 — The Visitor

**Name:** Yasmine, 34, looking to rent an apartment  
**Goals:** Quickly browse available apartments for rent, filter by budget, see photos and details before contacting.  
**Pain points:** Too many irrelevant results, slow pages, outdated listings.  
**Needs:** Fast category filtering, clear pricing, fresh photos, no forced registration.

### Persona 2 — The Admin

**Name:** Karim, real estate office manager  
**Goals:** Keep the listing catalog up to date — add new properties, fix prices when they change, upload new photos, remove sold properties.  
**Pain points:** Complex CMS tools, no easy way to bulk-update photos, having to ask a developer for every change.  
**Needs:** A simple, direct dashboard with clear forms for every action.

---

## 4. Scope

### In Scope (v1.0)

- Public-facing listing catalog with category and sale/rent filtering
- Property detail pages with photo gallery
- Admin login (single admin account)
- Admin dashboard: add, edit, update photos, delete listings
- Three property categories: Apartment, House, Villa
- Two listing types per category: For Sale, For Rent

### Out of Scope (v1.0)

- Visitor registration or user accounts
- In-app messaging or contact forms
- Mortgage calculator
- Agent profiles
- Multi-admin or role-based permissions
- Property comparison tool
- Email notifications

---

## 5. Functional Requirements

### 5.1 Visitor — Browse & Search

#### FR-V-01: Homepage
- Display a hero section with a search bar prominently visible.
- Show the three property categories as clickable cards: **Apartments**, **Houses**, **Villas**.
- Show featured/recent listings below the fold.

#### FR-V-02: Category Browsing
- Clicking a category navigates to a filtered listing page showing only that category.
- Each listing card displays: cover photo, title, price, location, number of rooms, surface area, and a "For Sale" or "For Rent" badge.

#### FR-V-03: Sale / Rent Filter
- On the listing page, a toggle or tab allows switching between "For Sale" and "For Rent" results.
- Default view shows all listings in the selected category.
- Filter state persists in the URL query string (e.g., `?category=apartment&type=rent`).

#### FR-V-04: Listing Detail Page
- Each listing has a dedicated page accessible via a unique URL slug.
- The page displays:
  - Full photo gallery (swipeable on mobile)
  - Title, price, listing type badge (For Sale / For Rent)
  - Category badge (Apartment / House / Villa)
  - Description
  - Key specs: surface area (m²), number of rooms, number of bathrooms, floor (if applicable), location
  - Availability status (Available / Under Offer / Sold/Rented)

#### FR-V-05: No Registration Required
- Visitors can browse and view all listings without creating an account.

---

### 5.2 Admin — Authentication

#### FR-A-01: Admin Login
- A login page is accessible at `/admin/login`.
- The admin enters their email and password.
- On success, a JWT token is issued and stored in an httpOnly cookie.
- On failure, a clear error message is displayed.
- The session expires after 8 hours of inactivity.

#### FR-A-02: Protected Routes
- All routes under `/admin/*` (except `/admin/login`) require a valid session.
- Unauthenticated access to any admin route redirects to `/admin/login`.

#### FR-A-03: Logout
- A logout button is always visible in the dashboard sidebar.
- Clicking it clears the session and redirects to `/admin/login`.

---

### 5.3 Admin — Dashboard Overview

#### FR-A-04: Stats Summary
- The dashboard home displays summary cards:
  - Total listings
  - Listings for sale
  - Listings for rent
  - Breakdown by category (Apartments, Houses, Villas)

#### FR-A-05: Listings Table
- A full table of all listings with columns: Photo thumbnail, Title, Category, Type (Sale/Rent), Price, Status, Date Added.
- The table is sortable by: date, price, category.
- The table is filterable by: category, type (sale/rent), status.
- Each row has quick-action buttons: **Edit** and **Delete**.

---

### 5.4 Admin — Add New Listing

#### FR-A-06: New Listing Form
The admin can create a new listing via a dedicated form at `/admin/listings/new`. Required fields:

| Field            | Type             | Notes                                      |
|------------------|------------------|--------------------------------------------|
| Title            | Text             | Required. Max 100 characters.              |
| Category         | Select           | Apartment / House / Villa                  |
| Listing Type     | Radio            | For Sale / For Rent                        |
| Price            | Number           | Required. Currency: local default (MAD/EUR)|
| Surface Area     | Number           | In m². Required.                           |
| Number of Rooms  | Number           | Required.                                  |
| Number of Bathrooms | Number        | Required.                                  |
| Floor            | Number           | Optional. Applicable for apartments.       |
| Location         | Text             | City / neighborhood. Required.             |
| Description      | Textarea         | Required. Max 1000 characters.             |
| Photos           | File upload      | Min 1, max 15 images. JPG/PNG/WEBP. Max 5MB each. |
| Availability     | Select           | Available / Under Offer / Sold/Rented      |

#### FR-A-07: Photo Upload on Create
- The admin can upload multiple photos at once during listing creation.
- A drag-and-drop zone and a file picker button are both available.
- Uploaded images show a thumbnail preview before submission.
- The first uploaded image is set as the cover photo by default; the admin can reorder.

#### FR-A-08: Form Validation
- All required fields must be filled before submission.
- Price and numeric fields must be positive numbers.
- Clear inline error messages appear for invalid fields.
- On successful submission, the admin is redirected to the listings table with a success notification.

---

### 5.5 Admin — Edit Listing

#### FR-A-09: Edit Listing Form
- Accessible at `/admin/listings/:id/edit`.
- Pre-populated with all existing listing data.
- The admin can update any field: title, description, price, category, type, location, surface area, rooms, bathrooms, floor, availability.
- Changes are saved on form submission.
- On success, a confirmation message is shown. The admin stays on the edit page.

#### FR-A-10: Price Update
- Price is an editable field on the edit form.
- No separate "price history" feature in v1.0.

---

### 5.6 Admin — Photo Management

#### FR-A-11: Photo Gallery Editor
- On the edit listing page, a photo gallery section shows all current photos as thumbnails.
- The admin can:
  - **Add new photos** — upload additional images to an existing listing (same constraints as FR-A-07).
  - **Remove a photo** — click a delete icon on any thumbnail to remove it (with a confirmation prompt).
  - **Set cover photo** — click a "Set as cover" button on any thumbnail to change the main listing photo.
  - **Reorder photos** — drag-and-drop thumbnails to change display order.
- Changes to photos are saved independently from the listing details form (separate "Save photos" button).
- A listing must always have at least 1 photo; removing the last photo is blocked with an error message.

---

### 5.7 Admin — Delete / Archive Listing

#### FR-A-12: Delete Listing
- A "Delete" button is available on the listings table row and on the edit page.
- Clicking it opens a confirmation modal: "Are you sure you want to delete this listing? This action cannot be undone."
- On confirmation, the listing and all its associated photos are permanently deleted.

#### FR-A-13: Archive Listing
- The admin can set a listing's status to **Sold/Rented** instead of deleting it.
- Archived listings remain visible in the admin table (filterable) but are hidden from the public listing pages.

---

## 6. Non-Functional Requirements

| Requirement       | Specification                                                    |
|-------------------|------------------------------------------------------------------|
| Performance       | Listing pages load in < 2.5s on a standard 4G connection        |
| Scalability       | Support up to 500 active listings in v1.0                       |
| Security          | Admin routes protected by JWT; photos served via signed S3 URLs |
| Responsiveness    | Fully functional on mobile (320px+), tablet, and desktop        |
| Accessibility     | WCAG 2.1 AA compliance for public-facing pages                  |
| SEO               | Listing pages use semantic HTML and meta tags for indexability   |
| Browser Support   | Latest 2 versions of Chrome, Firefox, Safari, Edge              |
| Uptime            | 99.5% uptime target for production                              |

---

## 7. Data Models

### Listing

```
listings
├── id              UUID, primary key
├── title           VARCHAR(100), not null
├── category        ENUM('apartment', 'house', 'villa'), not null
├── listing_type    ENUM('sale', 'rent'), not null
├── price           DECIMAL(12, 2), not null
├── surface_area    INTEGER (m²), not null
├── rooms           INTEGER, not null
├── bathrooms       INTEGER, not null
├── floor           INTEGER, nullable
├── location        VARCHAR(255), not null
├── description     TEXT, not null
├── status          ENUM('available', 'under_offer', 'sold_rented'), default 'available'
├── created_at      TIMESTAMP, default now()
└── updated_at      TIMESTAMP, default now()
```

### Photo

```
photos
├── id              UUID, primary key
├── listing_id      UUID, foreign key → listings.id (cascade delete)
├── url             TEXT (S3 URL), not null
├── is_cover        BOOLEAN, default false
├── display_order   INTEGER, default 0
└── created_at      TIMESTAMP, default now()
```

---

## 8. API Endpoints

### Public (no auth required)

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| GET    | `/api/listings`                 | Get all available listings (filterable by `category`, `type`) |
| GET    | `/api/listings/:id`             | Get a single listing with its photos     |

### Admin (JWT required)

| Method | Endpoint                        | Description                              |
|--------|---------------------------------|------------------------------------------|
| POST   | `/api/auth/login`               | Admin login — returns JWT                |
| POST   | `/api/auth/logout`              | Clear session                            |
| GET    | `/api/admin/listings`           | Get all listings (including archived)    |
| POST   | `/api/admin/listings`           | Create a new listing                     |
| PUT    | `/api/admin/listings/:id`       | Update listing details                   |
| DELETE | `/api/admin/listings/:id`       | Delete a listing permanently             |
| POST   | `/api/admin/listings/:id/photos`| Upload new photos to a listing           |
| DELETE | `/api/admin/photos/:photoId`    | Delete a specific photo                  |
| PATCH  | `/api/admin/photos/:photoId`    | Update photo (set cover, update order)   |

---

## 9. Page Map & Routes

### Public Routes

| Route                        | Page                          |
|------------------------------|-------------------------------|
| `/`                          | Homepage — hero + categories + featured listings |
| `/listings`                  | All listings (filterable)     |
| `/listings?category=apartment` | Apartments only             |
| `/listings?category=house`   | Houses only                   |
| `/listings?category=villa`   | Villas only                   |
| `/listings/:id`              | Single property detail page   |

### Admin Routes

| Route                          | Page                          |
|--------------------------------|-------------------------------|
| `/admin/login`                 | Admin login form              |
| `/admin`                       | Dashboard overview + stats    |
| `/admin/listings`              | All listings table            |
| `/admin/listings/new`          | Add new listing form          |
| `/admin/listings/:id/edit`     | Edit listing form + photo manager |

---

## 10. UI/UX Requirements

- The public site must have a clean, professional aesthetic suited to real estate browsing.
- Category cards on the homepage must be visually distinct and immediately recognizable.
- Listing cards must show: cover photo, title, price (bold), location, number of rooms, surface area, and a For Sale / For Rent badge.
- The admin dashboard uses a sidebar navigation with sections for: Overview, Listings, and Add New.
- All admin forms must have clear labels, helpful placeholder text, and inline validation errors.
- The photo upload area must support drag-and-drop and show live previews.
- The site must be fully usable on screens as small as 320px wide.
- Loading states and success/error notifications must be shown for all admin form submissions.

---

## 11. Out of Scope

The following features are explicitly excluded from v1.0 and may be considered for future versions:

- Visitor registration, login, or saved favorites
- In-app contact or messaging between visitors and the admin
- Multiple admin accounts or role-based access control
- Property comparison feature
- Mortgage or rental cost calculator
- Map-based property search
- Email or SMS notifications
- Multi-language support
- Analytics dashboard

---

## 12. Open Questions

| # | Question                                                         | Owner  | Status  |
|---|------------------------------------------------------------------|--------|---------|
| 1 | What currency should prices be displayed in? (MAD, EUR, both?)  | Admin  | Open    |
| 2 | Should archived (sold/rented) listings be publicly visible with a "Sold" label, or fully hidden? | Product | Open |
| 3 | Is there a maximum number of listings the admin expects to manage in year 1? | Admin | Open |
| 4 | Should listing URLs be human-readable slugs (e.g., `/listings/villa-casablanca-seafront`) or ID-based? | Dev | Open |
| 5 | Is a contact form (phone number, WhatsApp link) needed on listing detail pages? | Admin | Open |

---

*This document is a living specification. It will be updated as decisions are made on open questions and as new requirements emerge.*
