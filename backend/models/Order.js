
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cook: { type: mongoose.Schema.Types.ObjectId, ref: 'CookProfile', required: true },
  items: [{
    name: String,
    qty: Number,
    price: Number,
    category: String,
    calories: Number
  }],
  deliveryMode: { 
    type: String, 
    enum: ["self_pickup", "delivery_partner"],
    default: "delivery_partner"
  },
  subscriptionType: { 
    type: String, 
    enum: ["none", "weekly", "monthly"],
    default: "none"
  },
  pricingBreakdown: {
    itemTotal: Number,
    tax: Number,
    deliveryFee: Number,
    finalTotal: Number
  },
  status: { 
    type: String, 
    enum: ['placed', 'preparing', 'delivered'],
    default: 'placed'
  },
  deliveryAddress: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
