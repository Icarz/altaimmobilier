const router = require('express').Router();
const { getListings, getListing } = require('../controllers/listingsController');

router.get('/', getListings);
router.get('/:slug', getListing);

module.exports = router;
