const router = require('express').Router();
const { login, logout, me } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

module.exports = router;
