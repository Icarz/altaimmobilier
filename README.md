# 🏡 Alta Immobilier — Real Estate Website

A modern, full-featured real estate platform for browsing, listing, and managing property listings. Built for visitors looking to buy or rent, and for admins who manage the entire catalog.

---

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Features](#features)
  - [Visitor Features](#visitor-features)
  - [Admin Dashboard](#admin-dashboard)
- [Property Categories](#property-categories)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

EstateVista is a responsive real estate web application where visitors can browse and search properties by category — apartments, houses, and villas — filtering by listing type (for sale or for rent). Admins have a dedicated dashboard to manage the full property catalog: adding new listings, editing details, updating photos, and adjusting prices.

---

## User Roles

| Role    | Access                                                                 |
|---------|------------------------------------------------------------------------|
| Visitor | Browse listings, search by category, filter by sale/rent, view details |
| Admin   | Full dashboard access — create, edit, update, and delete listings      |

---

## Features

### Visitor Features

- 🔍 **Search by Category** — Browse properties filtered by Apartments, Houses, or Villas
- 🏷️ **Sale or Rent Filter** — Instantly toggle between properties for sale and for rent
- 📸 **Photo Galleries** — High-resolution image carousels on every listing page
- 🏠 **Detailed Listing Pages** — Full specs including price, surface area, rooms, location, and description
- 🗺️ **Interactive Map View** — Explore listings geographically on an embedded map
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

### Admin Dashboard

The admin dashboard is a protected area (login required) that gives the administrator full control over the property catalog.

#### Add New Listing
- Select property category: **Apartment**, **House**, or **Villa**
- Set listing type: **For Sale** or **For Rent**
- Fill in listing details: title, description, price, surface area, number of rooms, location, and availability status
- Upload one or multiple photos for the listing

#### Edit Existing Listings
- Update listing title, description, and all property details
- Change the price at any time (e.g., for promotions or market adjustments)
- Replace or add new photos to an existing listing
- Switch a listing between "For Sale" and "For Rent"
- Archive or delete a listing

#### Dashboard Overview
- Summary cards showing total listings, listings for sale, and listings for rent — broken down by category
- Full sortable and filterable table of all listings
- Quick-edit access directly from the listings table

---

## Property Categories

| Category    | Description                                                   |
|-------------|---------------------------------------------------------------|
| Apartment   | Units within multi-story buildings; available for sale or rent |
| House       | Standalone residential properties with private outdoor space  |
| Villa       | Premium properties with luxury amenities and larger grounds   |

Each category supports listings of two types: **For Sale** and **For Rent**.

---

## Tech Stack

| Layer        | Technology                           |
|--------------|--------------------------------------|
| Frontend     | React, Tailwind CSS                  |
| Backend      | Node.js, Express                     |
| Database     | PostgreSQL                           |
| Auth         | JWT + bcrypt (admin login)           |
| File Storage | AWS S3 (listing photos)              |
| Maps         | Google Maps API / Mapbox             |
| Deployment   | Vercel (frontend), Railway (backend) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL database
- Google Maps API key (or Mapbox token)
- AWS S3 bucket (for photo uploads)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/altaimmobilier.git
cd altaimmobiler
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Set up environment variables**

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. **Set up the database**

```bash
cd server
npm run db:migrate
npm run db:seed  # Optional: seed with sample listings
```

5. **Start the development servers**

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.  
The admin dashboard is at `http://localhost:5173/admin` (login required).

---

## Project Structure

```
altaimmobiler/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── listings/          # Listing cards, gallery, filters
│   │   │   └── admin/             # Dashboard UI components
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page with search
│   │   │   ├── Listings.jsx       # Browse by category
│   │   │   ├── ListingDetail.jsx  # Single property page
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx  # Admin overview & stats
│   │   │       ├── NewListing.jsx # Add new property form
│   │   │       └── EditListing.jsx# Edit existing property
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # Auth and filter state
│   │   └── utils/                 # Helper functions
│   └── public/
│
├── server/                        # Express backend
│   ├── controllers/
│   │   ├── listingsController.js  # CRUD for listings
│   │   └── authController.js      # Admin authentication
│   ├── models/                    # Database models
│   ├── routes/
│   │   ├── listings.js            # Public listing routes
│   │   └── admin.js               # Protected admin routes
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── upload.js              # Multer + S3 photo upload
│   └── db/                        # Migrations and seed data
│
└── README.md
```

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/altaimmobilier
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@altaimmobilier.com
ADMIN_PASSWORD=your_secure_password
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=eu-west-1
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## Available Scripts

### Backend

| Script               | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start dev server with hot reload   |
| `npm run start`      | Start production server            |
| `npm run db:migrate` | Run database migrations            |
| `npm run db:seed`    | Seed the database with sample data |

### Frontend

| Script             | Description                      |
|--------------------|----------------------------------|
| `npm run dev`      | Start Vite dev server            |
| `npm run build`    | Build for production             |
| `npm run preview`  | Preview production build locally |

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and write meaningful commit messages.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ for better real estate experiences.
