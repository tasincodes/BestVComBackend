const jwt= require('jsonwebtoken');
const User=require('../User/model');

const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
}=require('../../utility/errors');

const {generateOTP}=require('../../utility/common');

const{SendEmailUtility}=require('../../utility/email');
const createToken = require('../../utility/createToken');
const bcrypt = require('bcryptjs');


const registerUser=async(userData)=>{
    try{

        const {email,password}=userData;
        
        let isUser=await User.findOne({email:email}).select(
            'Email isVerified is Active Role'
        );
        if(isUser && !isUser.isVerified){
            throw new BadRequest("You have already registered with this email")
        }

        const otp=generateOTP();

        const emailBody= `Verification OTP:${otp}`;

        if(isUser){
            isUser.otp=otp;
            isUser.password=password;
            await isUser.save();
        }
        else{
            const newUser=await User.create({...userData,otp});

            isUser={
               email:newUser.email,
               isVerified:newUser.isVerified,
               isActive:newUser.isActive,
               role:newUser.role,
            };
            SendEmailUtility(email,emailBody,'OTP');
            return newUser;
        }

      

    }
    catch(err){
        throw err;
    }
}
const verifyUser = async (userData) => {
    try {
        const { email, OTP } = userData;
        let user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== OTP) {
            throw new Error("Incorrect OTP");
        }
        user.isVerified = true;

        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
}



module.exports={
    registerUser,verifyUser
}