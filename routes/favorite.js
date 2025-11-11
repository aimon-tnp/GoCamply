
/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Favorite campgrounds
 *
 * /api/v1/campgrounds/{campgroundId}/favorite:
 *   post:
 *     summary: Add campground to user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Favorite created
 *   delete:
 *     summary: Remove campground from user's favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed
 *
 * /api/v1/favorites:
 *   get:
 *     summary: Get current user's favorite campgrounds
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorites
 */

const express = require('express');
const { addFavorite ,removeFavorite,getMyFavorites} = require('../controllers/favorite');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.post('/', protect, addFavorite);
router.delete('/', protect, removeFavorite);
router.get('/', protect, getMyFavorites);


module.exports = router;