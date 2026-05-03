const Listing = require('../models/Listing');
const cloudinary = require('../config/cloudinary');

// GET /api/admin/listings — all listings including sold_rented
const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().select('-__v').sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/listings/:id
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).select('-__v');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/listings
const createListing = async (req, res, next) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/listings/:id
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== listing.title) {
      listing.title = req.body.title;
    }

    const updatableFields = [
      'category', 'listing_type', 'price_mad', 'surface_area',
      'rooms', 'bathrooms', 'floor', 'location', 'description', 'status',
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) listing[field] = req.body[field];
    });

    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/listings/:id — cascade delete Cloudinary photos
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.photos.length > 0) {
      await Promise.all(
        listing.photos.map((photo) => cloudinary.uploader.destroy(photo.public_id))
      );
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getListings, getListing, createListing, updateListing, deleteListing };
