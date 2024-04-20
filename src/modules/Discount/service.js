const discountModel = require("../Discount/model")
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


module.exports = {
    generateCouponService,
    updateCouponServicebyId,
    getAllCouponService,
    getAllCoupoByCategoryService,
    deleteCouponByIdService,
    getCouponByCodeService
}