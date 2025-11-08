
const express = require('express');
const { addFavorite } = require('../controllers/favorite');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.post('/', protect, addFavorite);
router.delete('/', protect, require('../controllers/favorite').removeFavorite);


module.exports = router;