const mongoose = require('mongoose');
const DiscountSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:'category'
        },
        couponName:{
            type : String,
            required : true
        },        
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        couponAmount: {
            type: Number,
            required: function () {
                return this.discountType === 'fixed'; 
            }
        },
        allowFreeShipping: {
            type: Boolean,
            default: false
        },
        couponExpiry: {
            type: String,
            required: true
        },
        
        // Usage restriction section fields
        minimumSpend: Number,
        maximumSpend: Number,
        individualUseOnly: {
            type: Boolean,
            default: false
        },
        excludeSaleItems: {
            type: Boolean,
            default: false
        },
        products: [String], // Array of product IDs
        excludeProducts: [String], // Array of product IDs to exclude
        categories: [String], // Array of category IDs
        excludeCategories: [String], // Array of category IDs to exclude
        productDiscountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        blockedAccounts: [String], // Array of user IDs
        
        // Usage limit section fields
        usageLimitPerCoupon: Number,
        limitUsageToXItems: Number,
        usageLimitPerUser: Number
    }, { timestamps: true },{versionKey:false})
const DiscountModel = mongoose.model('discount',DiscountSchema);
module.exports = DiscountModel;