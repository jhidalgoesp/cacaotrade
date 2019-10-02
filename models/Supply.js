const mongoose = require('mongoose');

const SupplySchema = new mongoose.Schema(
  {
    message: String,
    type: String,
    geolocation: String,
    weight: Number,
    price: Number,
    userId: mongoose.Schema.Types.ObjectId,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true
  }
);

mongoose.model('Supply', SupplySchema);

module.exports = mongoose.model('Supply');
