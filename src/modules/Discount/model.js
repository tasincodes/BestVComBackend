const mongoose = require('mongoose');
const DiscountSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'outlet'
    },
    discountName :{
        type : String,
        required:true,
        max : [30,"discount name should be under 30 character"]
    },
    discountCode : {
        type : String,
        required:true,
        max : [10,"Promo code should be under 10 character"]
    },
    startDate : {
        type : Date,
        required:true,
        default : Date.now
    },
    expiryDate : {
        type : Date,
        required:true,
    },
    minimumSpend :{
        type : String,
        required: True
    },
    maximumSpend : {
        type : String,
        required : True
    }

},{versionKey:false})
const DiscountModel = mongoose.model('discount',DiscountSchema);
module.exports = DiscountModel;