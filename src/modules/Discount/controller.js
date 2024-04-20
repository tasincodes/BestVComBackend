const express=require('express');
const router=express.Router();
const { asyncHandler } =require('../../utility/common');
const discountService = require('./service')


const couponGenerateHandler = asyncHandler(async(req,res)=>{
    const couponInfo = req.body;
    const coupon = await discountService.generateCoupon(couponInfo)
    res.status(200).json({
        message: "coupon added successfully",
        coupon
    });

})


router.post('/createCoupon',couponGenerateHandler)

module.exports = router;