const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
  {
    message: String,
    geolocation: String,
    bid: Number,
    weight: Number,
    userId: mongoose.Schema.Types.ObjectId,
    publicationId: mongoose.Schema.Types.ObjectId,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

mongoose.model('Offer', OfferSchema);

module.exports = mongoose.model('Offer');
