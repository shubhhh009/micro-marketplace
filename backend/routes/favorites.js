const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');
const auth = require('../middleware/auth');

router.use(auth); // All favorites routes require auth

router.post('/:productId', favoritesController.addFavorite);
router.delete('/:productId', favoritesController.removeFavorite);
router.get('/', favoritesController.getFavorites);

module.exports = router;
