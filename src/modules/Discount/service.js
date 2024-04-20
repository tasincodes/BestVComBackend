const discountModel = require("../Discount/model")
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
}=require('../../utility/errors');

const generateCouponService = async(couponInfo)=>{
    try {
        
        const newCoupon = await discountModel.create(
            couponInfo);
        return { couponInfo : couponInfo}
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



module.exports = {
    generateCouponService,
    updateCouponServicebyId
}