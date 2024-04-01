const express = require('express');
const router = express.Router();
const { validate } = require('../../middlewares/schemaValidation'); // Corrected import

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







// Register a new user

const registerHandler = asyncHandler(async(req, res) => {
  const { email, phoneNumber, password, role } = req.body;
  const user = await authService.UserRegister(email, phoneNumber, password, role);

  res.status(200).json({
      message: "Your account has been registered. Please check your email for the OTP.",
      email: user.email,
      user,
  });
});







// Verify OTP

const otpVerifyHandler = asyncHandler(async(req,res)=>{
  const { email, otp } = req.body;
  const verify=await authService.verifyOTP(email,otp)
  
    res.json({
       message: 'OTP verified successfully. User activated.',
       verify
      });
});



//Resend OTP

const resendOTPHandler = asyncHandler(async(req,res)=>{
  
  const { email } = req.body;
  const otpResend = await authService.resendOTP(email);
  res.status(200).json({
    otpResend
  });


})

//Expire OTP
const expireOTP = async (req, res, next) => {
  try {
    await authService.expireOTP(req.body);

    res.status(200).json({
      message: 'OTP expired',
    });
  } catch (err) {
    next(err, req, res);
  }
};






router.post('/adminRegister',registerHandler);
router.post('/otpVerification',otpVerifyHandler);
router.post('/otpResend',resendOTPHandler);
router.post('/expireOTP',expireOTP);




module.exports = router;
