const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema(
  {
    message: String,
    type: String,
    geolocation: String,
    weight: Number,
    price: Number,
    userId: mongoose.Schema.Types.ObjectId,
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

mongoose.model('Publication', PublicationSchema);

module.exports = mongoose.model('Publication');
