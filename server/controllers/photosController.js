const Listing = require('../models/Listing');
const cloudinary = require('../config/cloudinary');

// Upload a buffer to Cloudinary and return the result
const uploadBuffer = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64}`;
  return cloudinary.uploader.upload(dataUri, {
    folder: 'alta-immobilier',
    resource_type: 'image',
  });
};

// POST /api/admin/listings/:id/photos
const uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const currentCount = listing.photos.length;
    if (currentCount + req.files.length > 15) {
      return res.status(400).json({
        message: `Cannot add ${req.files.length} photo(s). Max 15 per listing (currently ${currentCount}).`,
      });
    }

    const uploaded = await Promise.all(
      req.files.map((file) => uploadBuffer(file.buffer, file.mimetype))
    );

    const newPhotos = uploaded.map((result, index) => ({
      url: result.secure_url,
      public_id: result.public_id,
      is_cover: currentCount === 0 && index === 0, // First photo ever = cover
      display_order: currentCount + index,
    }));

    listing.photos.push(...newPhotos);
    await listing.save();

    res.status(201).json({ photos: listing.photos });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/listings/:id/photos/:photoId
// Body: { is_cover: true } or { display_order: 2 }
const updatePhoto = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const photo = listing.photos.id(req.params.photoId);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Setting a new cover — unset the previous one
    if (req.body.is_cover === true) {
      listing.photos.forEach((p) => { p.is_cover = false; });
      photo.is_cover = true;
    }

    if (req.body.display_order !== undefined) {
      photo.display_order = req.body.display_order;
    }

    await listing.save();
    res.json({ photos: listing.photos });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/listings/:id/photos/:photoId
const deletePhoto = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const photo = listing.photos.id(req.params.photoId);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.public_id);

    const wasCover = photo.is_cover;
    photo.deleteOne();

    // If deleted photo was the cover, assign cover to first remaining photo
    if (wasCover && listing.photos.length > 0) {
      listing.photos[0].is_cover = true;
    }

    await listing.save();
    res.json({ photos: listing.photos });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/listings/:id/photos/reorder
// Body: { order: ['photoId1', 'photoId2', ...] }
const reorderPhotos = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: 'order must be a non-empty array of photo IDs' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    order.forEach((photoId, index) => {
      const photo = listing.photos.id(photoId);
      if (photo) photo.display_order = index;
    });

    await listing.save();
    res.json({ photos: listing.photos });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadPhotos, updatePhoto, deletePhoto, reorderPhotos };
