const mongoose = require('mongoose');
const DiscountSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'outlet'
    },
    DiscountName :{
        type : String,
        required:true,
        max : [30,"discount name should be under 30 character"]
    },
    DiscountCode : {
        type : String,
        required:true,
        max : [10,"Promo code should be under 10 character"]
    },
    StartDate : {
        type : Date,
        required:true,
        default : Date.now
    },
    ExpiryDate : {
        type : Date,
        required:true,
    },
    MinimumSpend :{
        type : String,
        required: True
    },
    MaximumSpend : {
        type : String,
        required : True
    }

},{versionKey:false})
const DiscountModel = mongoose.model('discount',DiscountSchema);
module.exports = DiscountModel;