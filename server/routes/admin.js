const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} = require('../controllers/adminController');
const {
  uploadPhotos,
  deletePhoto,
  updatePhoto,
  reorderPhotos,
} = require('../controllers/photosController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WEBP files are allowed'));
    }
  },
});

// All admin routes require authentication
router.use(auth);

// Listings CRUD
router.get('/listings', getListings);
router.post('/listings', createListing);
router.get('/listings/:id', getListing);
router.put('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

// Photo management
router.post('/listings/:id/photos', upload.array('photos', 15), uploadPhotos);
router.put('/listings/:id/photos/reorder', reorderPhotos);
router.patch('/listings/:id/photos/:photoId', updatePhoto);
router.delete('/listings/:id/photos/:photoId', deletePhoto);

module.exports = router;
