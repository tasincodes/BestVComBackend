const mongoose = require("mongoose");

const OrderSchema= new mongoose.Schema({

    customer:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'customer'
    },
    orderType: {
        type: String,
        enum: ["Delivery", "Pickup", "Online"],
        required: [true, "Please select a delivery type"],
      },

      orderStatus: {
        type: Number,
        // [ 0.Order Received 1.Order Confirmed 2. Order Dispatched 3.Order Delivered 4.On-Hold 5.Order Cancelled 6.Order Spammed
        enum: [0, 1, 2, 3, 4, 5,6],
        default: 0,
      },
      

      deliveryAddress: {
        type:String,
      },
     district:{
      type:String,
     },
     phoneNumber:{
      type: String,
      required: [true, "Customer phone number is required"],
     },
     vatRate: {
      type: Number,
      default: 0,
      max: [100, "Your tax rate cannot exceed 100"],
    },
      // vatStatus: {
    //   type: String,
    //   enum: ["inclusive", "exclusive"],
    //   default: "inclusive",
    // },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
   transactionId: String,

   products: [{
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Must select a item"],
    },
}],

  coupon:{
    _id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"coupon"
    }
  },
  totalOrderValue:{
    type:String,
    required: [true, "Total order value is required"],
  },
  discountAmount:{
    type:String,
    
  }


      
},{ timestamps: true }) ;

const OrderModel=mongoose.model('Order',OrderSchema);

module.exports = OrderModel