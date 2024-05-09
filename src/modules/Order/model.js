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
      enum: [0, 1, 2, 3, 4, 5, 6],
      default: 0
  },
  deliveryAddress: {
      type: String,
      required: true
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
  }],
  coupon: {
      _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "coupon"
      }
  },
  discountAmount: Number,
  totalPrice: Number,
  vatRate: Number
}, { timestamps: true });

const OrderModel=mongoose.model('Order',OrderSchema);

module.exports = OrderModel