const express=require('express');
const router=express.Router();
const { asyncHandler } =require('../../utility/common');
const discountService = require('./service');
const { addSubcategory } = require('../Category/service');


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


const getAllCouponHandler = asyncHandler(async(req,res)=>{
    const allCoupon = await discountService.getAllCouponService()
    res.status(200).json({
        allCoupon
    });
})

const getAllCouponByCategoryHandler = asyncHandler(async(req,res)=>{
    const categoryId = req.params.userId;
    const allCoupon = await discountService.getAllCoupoByCategoryService(categoryId)
    res.status(200).json({
        allCoupon
    });
})

const deleteCouponByIdHandler = asyncHandler(async (req, res) => {
    const couponId = req.params.id;
    const deletedCoupon = await discountService.deleteCouponByIdService(couponId);
    if (deletedCoupon) {
        res.status(200).json({ message: 'Coupon deleted successfully' });
    } else {
        res.status(404).json({ message: 'Coupon not found' });
    }
});

const getCouponByCodeHandler = asyncHandler(async (req, res) => {
    const couponCode = req.params.code;
    const coupon = await discountService.getCouponByCodeService(couponCode);
    if (coupon) {
        res.status(200).json({ coupon });
    } else {
        res.status(404).json({ message: 'Coupon not found' });
    }
});


const getDiscountByCouponHandler = asyncHandler(async(req,res)=>{
    const couponId = req.params.id;
    const totalPrice = req.params.price;
    const couponConfirmation = await discountService.getDiscountByCoupon(couponId,totalPrice);
    if(couponConfirmation){
        res.status(200).json({couponConfirmation})
    }
    else {
        res.status(404).json({ message: 'Coupon coudnt get authorized' });
    }
})



router.post('/createCoupon',couponGenerateHandler);
router.put('/updateCoupon/:id',couponUpdateHandler);
router.get('/getAllCoupon',getAllCouponHandler);
router.get('/getAllCouponByCat/:userId',getAllCouponByCategoryHandler);
router.delete('/deleteCouponById/:id', deleteCouponByIdHandler);
router.get('/getCouponByCode/:code', getCouponByCodeHandler);

module.exports = router;