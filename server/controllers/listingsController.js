const Listing = require('../models/Listing');

// GET /api/listings?category=&type=
const getListings = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.listing_type = type;

    const listings = await Listing.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    next(err);
  }
};

// GET /api/listings/:slug
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug }).select('-__v');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

module.exports = { getListings, getListing };
