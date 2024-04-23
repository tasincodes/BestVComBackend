const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    general:{
    couponName: {
        type: String,
        required: true,
        unique:true,
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
        type: Date,
        required: true
    },

},
    usageRestriction: {
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
        products: [String],
        excludeProducts: [String],
        categories: [String],
        excludeCategories: [String],
        blockedAccounts: [String]
    },
    usageLimit: {
        usageLimitPerCoupon: Number,
        limitUsageToXItems: Number,
        usageLimitPerUser: Number
    }
}, { timestamps: true });

const CouponModel = mongoose.model('coupon', CouponSchema);
module.exports = CouponModel;
