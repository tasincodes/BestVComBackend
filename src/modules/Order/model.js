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
        // [ 0.Order Received 1.Order Confirmed 2.Order Processing 3.Order Delivered 4.Order On-Hold 5.Order Cancelled 6.Order Spammed
        enum: [0, 1, 2, 3, 4, 5,6],
        default: 1,
      },
      

      
}) 