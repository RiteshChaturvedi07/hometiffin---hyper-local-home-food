
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  firebaseUid: { type: String, required: true, unique: true },
  role: { type: String, enum: ['customer', 'cook', 'admin'], default: 'customer' },
  addresses: [{
    label: String,
    street: String,
    lat: Number,
    lng: Number
  }],
  walletBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
