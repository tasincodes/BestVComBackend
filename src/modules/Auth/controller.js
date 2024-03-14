const express = require('express');
const router = express.Router();

const handleValidation = require('../../middlewares/schemaValidation');
const {
    HEAD_OFFICE,
    BRANCH_ADMIN,
    CUSTOMER

}=require('../../config/constants');


const authService = require('./service');
const { adminValidate } = require('./request');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');



// create Admin/User

const userSignUpHandler=asyncHandler(async(req,res)=>{
    const user =await authService.registerUser(req.body);
    res.status(200).json({
        email:user.email,
        user,
        message:"User Registration Success please check your mail for the OTP"

    });
})
const userVerifier=asyncHandler(async(req,res)=>{
    const user =await authService.verifyUser(req.body);
    res.status(200).json({
        email:user.email,
        user,
        message:"User verification success"

    });
})


router.post('/registration',userSignUpHandler);
router.post('/verifytoken',userVerifier);

module.exports = router;