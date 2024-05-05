const discountModel = require("../Discount/model");
const productModel = require("../Products/model");
const Category = require("../Category/model");
const User = require("../User/model");
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
}=require('../../utility/errors');
const { errorMonitor } = require("nodemailer/lib/xoauth2");

const generateCouponService = async(couponInfo)=>{
    try {
        
        const newCoupon = await discountModel.create(
            couponInfo);
        return { couponInfo : newCoupon}
    } catch (error) {
        console.error(error);
    
        return { couponInfo: null };
    }
};


const updateCouponServicebyId = async(id,updatedInfo)=>{
    try{
const couponUpdates = await discountModel.findByIdAndUpdate(id,updatedInfo,
    { new: true })
if(couponUpdates){
    return {couponUpdates: couponUpdates}
}
    }
    catch(err){
        console.error(error);
        return { couponUpdates: null };
    } 
}

const getAllCouponService = async()=>{
    try{
        return await discountModel.find()
    }
    catch(error){
        console.error(error);
        return error
    }
}

const getAllCoupoByCategoryService = async(userId)=>{
    try{
        return await discountModel.find({ userId: userId })
    }
    catch(error){
        console.error(error);
        return error
    }
}

const deleteCouponByIdService = async (couponId) => {
    try {
        return await discountModel.findByIdAndDelete(couponId);
    } catch (error) {
        console.error(error);
        return null;
    }
}
const getCouponByCodeService = async (couponCode) => {
    try {
        return await discountModel.findOne({ couponName: couponCode });
    } catch (error) {
        console.error(error);
        return null;
    }
}


const getDiscountByCoupon = async (couponId, totalPrice, requestedProducts,userId) => {
    const coupon = await discountModel.findById(couponId);
    if (!coupon) {
        throw new BadRequest("Coupon code is not available");
    }

    const currentDate = new Date();
    if (currentDate > coupon.general.couponExpiry) {
        throw new BadRequest("Coupon code expired");
    }

    if (totalPrice < coupon.usageRestriction.minimumSpend) {
        throw new BadRequest("You need to spend more to access the coupon");
    }

    if (totalPrice > coupon.usageRestriction.maximumSpend) {
        throw new BadRequest("You need to spend less to access the coupon");
    }

    // Check if the coupon is blocked for all users
    if (coupon.usageLimit.usageLimitPerCoupon <= 0) {
        throw new BadRequest("Coupon is no longer available");
    }

    // Check if the user has reached the usage limit for this coupon
    if (coupon.usageLimit.usageLimitPerUser <= 0) {
        throw new BadRequest("You have reached the maximum usage limit for this coupon");
    }

    // Check if the user account is blocked
    if (coupon.usageRestriction.blockedAccounts.includes(userId)) {
        throw new BadRequest("Your account is blocked and cannot use this coupon");
    }

    // Check if requested products are included/excluded based on coupon restrictions
    const requestedProductData = await productModel.find({ _id: { $in: requestedProducts } });
    requestedProductData.forEach(product => {
        if (!coupon.usageRestriction.products.includes(product._id.toString())) {
            throw new BadRequest(`Product ${product.productName} is not eligible for this coupon`);
        }
        if (coupon.usageRestriction.excludeProducts.includes(product._id.toString())) {
            throw new BadRequest(`Product ${product.productName} is excluded from this coupon`);
        }
    });

    const categoryIds = [...new Set(requestedProductData.map(product => product.categoryId))];
    const categoryData = await Category.find({ _id: { $in: categoryIds } });

    
    categoryData.forEach(category => {
        if (!coupon.usageRestriction.categories.includes(category._id.toString())) {
            throw new BadRequest(`Category ${category.categoryName} is not eligible for this coupon`);
        }
        if (coupon.usageRestriction.excludeCategories.includes(category._id.toString())) {
            throw new BadRequest(`Category ${category.categoryName} is excluded from this coupon`);
        }
    });

    let discount = 0;
    if (coupon.general.discountType === 'percentage') {
        discount = (coupon.general.couponAmount / 100) * totalPrice;
    } else {
        discount = coupon.general.couponAmount;
    }

    coupon.usageLimit.usageLimitPerCoupon -= 1;
    coupon.usageLimit.usageLimitPerUser -= 1;

    await coupon.save();

    return discount;
};

const getCouponByTypeService = async (discountType) => {
    try {
        let coupons;
        if (discountType === "fixed" || discountType === "percentage") {
            coupons = await discountModel.find({ "general.discountType": discountType });
        } else {
            coupons = [];
        }
        return coupons;
    } catch (error) {
        console.error(error);
        throw error;
    }
}




module.exports = {
    generateCouponService,
    updateCouponServicebyId,
    getAllCouponService,
    getAllCoupoByCategoryService,
    deleteCouponByIdService,
    getCouponByCodeService,
    getDiscountByCoupon,
    getCouponByTypeService
}