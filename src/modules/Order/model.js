const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'customer'
  },
  orderType: {
    type: String,
    enum: ["Delivery", "Pickup", "Online"],
    required: true
  },
  orderStatus: {
    type: Number,

//Order Received-->0
// Order Confirmed (Processing) -->1
// Order Dispatched --->2
// Order Delivered-->3
// Order On-Hold --->4
// Order Cancelled--->5
// Order Spammed --->6
    enum: [0, 1, 2, 3, 4, 5, 6],
    default: 0
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryCharge:{
    type:Number,
  },
  district: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  transactionId: String,
  products: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  coupon: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon"
    }
  },
  discountAmount: Number,
  totalPrice: {
    type: Number,
    required: true
  },
  vatRate: Number
}, { timestamps: true });

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
