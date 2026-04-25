
const mongoose = require('mongoose');

const CookProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kitchenName: { type: String, required: true },
  description: { type: String },
  isVerified: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  kitchenImages: [String],
  categories: [{ 
    type: String, 
    enum: ["Standard Thali", "Keto/Gym", "School Tiffin", "Fruit/Salad Bowl", "Smoothies"] 
  }],
  onboardingStatus: { 
    type: String, 
    enum: ["pending_details", "pending_verification", "active"],
    default: "pending_details"
  },
  printerSettings: {
    hasThermalPrinter: { type: Boolean, default: false }
  },
  serviceRadiusKm: { type: Number, default: 5 },
  foodType: { type: String, enum: ['veg', 'non-veg', 'both'], required: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

// Crucial for Geospatial Queries
CookProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CookProfile', CookProfileSchema);
