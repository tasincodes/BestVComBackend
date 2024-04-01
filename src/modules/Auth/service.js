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






// Admin Register a new user

const UserRegister = async (email, phoneNumber, password, role) => {
  try {
      // Generate OTP
      const otp = generateOTP(); // Make sure generateOTP is imported properly

      // Save user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
          email,
          phoneNumber,
          password: hashedPassword,
          role,
          otp,
      });
      await user.save();

      // Send OTP to email
      await SendEmailUtility(email, 'OTP for registration', `Your OTP for registration: ${otp}`);

      // Return
      return user;
  } catch (error) {
      console.error(error); // Log the error
      throw new BadRequest('Failed to register user.');
  }
};




// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
      const user = await User.findOne({ email, otp });
      if (!user) {
          throw new BadRequest('Invalid OTP.');
      }

      // Update user
      user.isActive = true;
      user.isVerified = true;
      user.otp = undefined; // Clear OTP after verification
      await user.save();
  } catch (error) {
      throw new BadRequest('Failed to verify OTP.');
  }
};








module.exports = {
  UserRegister,
  verifyOTP
};


  
 



