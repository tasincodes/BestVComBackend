const express = require('express');
const router = express.Router();

const userService=require('../User/service');

const {
  brandManagerValidate,
  changeUserDetailsValidate,
  changePasswordValidate,
} = require('./request');

const authMiddleware = require('../../middlewares/authMiddleware');
const handleValidation = require('../../middlewares/schemaValidation');
const { asyncHandler } = require('../../utility/common');




const resetPasswordHandler = asyncHandler(async(req,res)=>{

    const { email, newPassword } = req.body;
   
        const response = await userService.resetPassword(email, newPassword);
        res.status(200).json({
            message:"Successfully reset password",
            response
        });
   
})



router.post('/resetPass',resetPasswordHandler);

module.exports = router;
