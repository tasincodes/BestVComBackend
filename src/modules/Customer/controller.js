const express=require('express');
const router=express.Router();
const { asyncHandler } =require('../../utility/common');
const customerService = require('./service')


const createCustomerhandler = asyncHandler(async (req, res) => {
    const customer = await customerService.customerCreateService(req.body);
    res.status(200).json({
        message: "customer added successfully",
        customer
    });
});


router.post('/createCustomer',createCustomerhandler)

 module.exports = router;