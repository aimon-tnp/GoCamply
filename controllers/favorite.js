const Favorite = require('../models/Favorite');

// @desc    Add favorite campground
// POST /api/v1/campgrounds/:campgroundId/favorite
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      campground: req.params.campgroundId,
    });

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (err) {
    console.log(err); // ดูใน console ว่า error จริงคืออะไร

    // ถ้าเป็น duplicate key (user + campground ซ้ำ)
    if (err.code === 11000) {
        return res.status(400).json({
        success: false,
        message: 'Already favorited',
        });
    }

    // error แบบอื่น
    return res.status(500).json({
        success: false,
        message: 'Cannot add favorite',
    });
    }
};

// @desc    Remove favorite campground
// DELETE /api/v1/campgrounds/:campgroundId/favorite
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    await Favorite.deleteOne({
      user: req.user.id,
      campground: req.params.campgroundId,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cannot remove favorite',
    });
  }
};

// @desc    Get current user's favorite campgrounds
// GET /api/v1/favorites
// @access  Private
exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate({
      path: 'campground',
      select: 'name address telephone',
    });



    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cannot get favorites',
    });
  }
};