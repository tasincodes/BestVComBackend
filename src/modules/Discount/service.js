const discountModel = require("../Discount/model")
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
}=require('../../utility/errors');

const generateCoupon = async(couponInfo)=>{
    try {
        
        const newCoupon = await discountModel.create(
            couponInfo);
        return { couponInfo : couponInfo}
    } catch (error) {
        console.error(error);
    
        return { customer: null };
    }
};


module.exports = {
    generateCoupon
}