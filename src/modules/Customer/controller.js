const express=require('express');
const router=express.Router();
const { asyncHandler } =require('../../utility/common');
const customerService = require('./service')
const authMiddleware= require('../../middlewares/authMiddleware');
const roleMiddleware= require('../../middlewares/roleMiddleware');
const { HEAD_OFFICE,BRANCH_ADMIN } = require('../../config/constants');

const createCustomerhandler = asyncHandler(async (req, res) => {
  const customer = await customerService.customerCreateService(req.body);
  if (customer) {
    res.status(200).json({
      message: "customer added successfully",
      customer,
    });
  } else {
    res.status(400).json({
      message: "Couldn't add customer successfully",
    });
  }
});



const getAllCustomerhandler = asyncHandler(async (req, res) => {
    const customer = await customerService.getAllCustomerService();
    res.status(200).json({
        message: "customer added successfully",
        customer
    });
});



const forgetCredentialshandler = asyncHandler(async(req,res)=>{
    const {email,phoneNumber} = req.body
    await customerService.forgetInfoService(email,phoneNumber)
    res.status(200).json({
        message: "OTP is sent to email",email
    });
})


const otpVerifyHandler = asyncHandler(async(req,res)=>{
    const { email, otp } = req.body;
    const verify=await customerService.verifyOTP(email,otp)
    
      res.json({
         message: 'OTP verified successfully',
         verify
        });
  });


  const expireOTP = async (req, res, next) => {
    try {
      await customerService.expireOTP(req.body);
  
      res.status(200).json({
        message: 'OTP expired',
      });
    } catch (err) {
      next(err, req, res);
    }
  };

  const customerSignInHandler= async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await customerService.customerSignInService(email, password);
      res.status(200).json({
        message: 'User signed in successfully.',
        user
      });
    } catch (error) {
      res.status(401).json({
        error: error.message
      });
    }
  };


router.post('/createCustomer',createCustomerhandler)
router.get('/getCustomer',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),getAllCustomerhandler)
router.post('/forgetCred',forgetCredentialshandler)
router.get('/otpverify',otpVerifyHandler)
router.post('/expiredOtp',expireOTP)
router.post('/customerSignIn',customerSignInHandler)
 module.exports = router;