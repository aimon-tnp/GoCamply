const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  campground: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campground',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ไม่ให้คนเดียวกัน favorite camp เดิมซ้ำ
FavoriteSchema.index({ user: 1, campground: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);