const express=require('express');
const router=express.Router();
const { asyncHandler } =require('../../utility/common');
const discountService = require('./service')


const couponGenerateHandler = asyncHandler(async(req,res)=>{
    const couponInfo = req.body;
    const coupon = await discountService.generateCouponService(couponInfo)
    res.status(200).json({
        message: "coupon added successfully",
        coupon
    });

})


const couponUpdateHandler = asyncHandler(async(req,res)=>{
    const couponId = req.params.id;
    const updatedInfo = req.body;
    const couponUpdates = await discountService.updateCouponServicebyId(couponId,updatedInfo)
    res.status(200).json({
        message: "coupon updated successfully",
        couponUpdates
    });

})


router.post('/createCoupon',couponGenerateHandler)
router.put('/updateCoupon/:id',couponUpdateHandler)
module.exports = router;