const mongoose = require('mongoose');
const slugify = require('slugify');

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  is_cover: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
});

const listingSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ['apartment', 'house', 'villa'], required: true },
    listing_type: { type: String, enum: ['sale', 'rent'], required: true },
    price_mad: { type: Number, required: true },
    surface_area: { type: Number, required: true },
    rooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    floor: { type: Number, default: null },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['available', 'sold_rented'], default: 'available' },
    photos: [photoSchema],
  },
  { timestamps: true }
);

// Virtual: price in EUR (1 EUR = 10.8 MAD)
listingSchema.virtual('price_eur').get(function () {
  return Math.round(this.price_mad / 10.8);
});

listingSchema.set('toJSON', { virtuals: true });
listingSchema.set('toObject', { virtuals: true });

// Auto-generate unique slug from title before saving
listingSchema.pre('save', async function (next) {
  if (!this.isModified('title') && this.slug) return next();

  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let count = 1;

  while (
    await mongoose.model('Listing').findOne({ slug, _id: { $ne: this._id } })
  ) {
    slug = `${base}-${++count}`;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
