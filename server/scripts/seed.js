require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

const listings = [
  {
    title: 'Appartement Moderne Maarif',
    category: 'apartment',
    listing_type: 'sale',
    price_mad: 1800000,
    surface_area: 120,
    rooms: 3,
    bathrooms: 2,
    floor: 4,
    location: 'Maarif, Casablanca',
    description:
      'Bel appartement moderne entièrement rénové dans le quartier Maarif. Lumineux, avec une cuisine équipée, un salon spacieux et une vue dégagée.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        public_id: 'seed/apt-maarif-1',
        is_cover: true,
        display_order: 0,
      },
    ],
  },
  {
    title: 'Villa Avec Piscine Ain Diab',
    category: 'villa',
    listing_type: 'sale',
    price_mad: 8500000,
    surface_area: 450,
    rooms: 6,
    bathrooms: 4,
    floor: null,
    location: 'Ain Diab, Casablanca',
    description:
      'Magnifique villa avec piscine privée, jardin paysager et garage double. Idéale pour une famille. Proche de la Corniche.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800',
        public_id: 'seed/villa-aindiab-1',
        is_cover: true,
        display_order: 0,
      },
    ],
  },
  {
    title: 'Appartement à Louer Gueliz',
    category: 'apartment',
    listing_type: 'rent',
    price_mad: 8000,
    surface_area: 85,
    rooms: 2,
    bathrooms: 1,
    floor: 2,
    location: 'Guéliz, Marrakech',
    description:
      'Appartement meublé en plein cœur de Guéliz. Idéalement situé à deux pas des commerces et restaurants. Disponible immédiatement.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        public_id: 'seed/apt-gueliz-1',
        is_cover: true,
        display_order: 0,
      },
    ],
  },
  {
    title: 'Maison Traditionnelle Médina',
    category: 'house',
    listing_type: 'sale',
    price_mad: 3200000,
    surface_area: 200,
    rooms: 4,
    bathrooms: 2,
    floor: null,
    location: 'Médina, Marrakech',
    description:
      'Riad authentique avec patio central, fontaine et terrasse panoramique. Architecture traditionnelle préservée avec toutes les commodités modernes.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?w=800',
        public_id: 'seed/riad-medina-1',
        is_cover: true,
        display_order: 0,
      },
    ],
  },
  {
    title: 'Villa Bord de Mer Agadir',
    category: 'villa',
    listing_type: 'rent',
    price_mad: 25000,
    surface_area: 300,
    rooms: 5,
    bathrooms: 3,
    floor: null,
    location: 'Bord de mer, Agadir',
    description:
      "Villa luxueuse face à l'océan avec accès direct à la plage. Piscine, terrasse, barbecue. Location à la semaine ou au mois.",
    status: 'sold_rented',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
        public_id: 'seed/villa-agadir-1',
        is_cover: true,
        display_order: 0,
      },
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Listing.deleteMany({});
    console.log('Cleared existing listings');

    for (const data of listings) {
      const listing = new Listing(data);
      await listing.save();
    }
    console.log(`Seeded ${listings.length} listings`);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
