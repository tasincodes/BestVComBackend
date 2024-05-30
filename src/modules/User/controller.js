const express = require('express');
const router = express.Router();

const userService=require('../User/service');

const {
  brandManagerValidate,
  changeUserDetailsValidate,
  changePasswordValidate,
} = require('./request');

const authMiddleware = require('../../middlewares/authMiddleware');
roleMiddleware = require('../../middlewares/roleMiddleware');
const handleValidation = require('../../middlewares/schemaValidation');
const { asyncHandler } = require('../../utility/common');
const { HEAD_OFFICE,BRANCH_ADMIN } = require('../../config/constants');




const resetPasswordHandler = asyncHandler(async(req,res)=>{

    const { email, newPassword } = req.body;
   
        const response = await userService.resetPassword(email, newPassword);
        res.status(200).json({
            message:"Successfully reset password",
            response
        });
   
})



// getAllUsers

const getAllUsersHandler=asyncHandler(async(req,res)=>{
    const users=await userService.getAllUsers();
    res.status(200).json({
       message:"User get successfully",
        users
    })
})




// Route to request OTP

const userResetHandler = asyncHandler(async(req,res)=>{
    const { email } = req.body;

      await userService.userResetLink(email);
      res.status(200).json({
        message:"OTP sent successfully",
        
      })
  
});


// verifyOTP for the forgetPassword

const verifyOTPHandler = asyncHandler(async(req,res)=>{
    const { email, otp } = req.body;
    await userService.verifyOTP(email, otp);
    res.status(200).json({
        message:"OTP verified successfully"
    })
 
})




router.post('/resetPass',resetPasswordHandler);
router.get('/allUsers', authMiddleware, roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]), getAllUsersHandler);
router.post('/resetUser',userResetHandler);
router.post('/checkOTP',verifyOTPHandler);

module.exports = router;
