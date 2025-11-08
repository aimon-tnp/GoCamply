
const express = require('express');
const { addFavorite ,removeFavorite,getMyFavorites} = require('../controllers/favorite');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.post('/', protect, addFavorite);
router.delete('/', protect, removeFavorite);
router.get('/', protect, getMyFavorites);


module.exports = router;