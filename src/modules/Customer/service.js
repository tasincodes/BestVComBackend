const CustomerModel = require("../Customer/model");
const customerModel = require("../Customer/model")
const {generateOTP}=require('../../utility/common');
const {otpMail} = require('../../utility/email')
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
}=require('../../utility/errors');

const customerCreateService = async (customerInfo) => {
    try {
        
        const newCustomer = await customerModel.create(
customerInfo);
        return { customer:newCustomer }
    } catch (error) {
        console.error(error);
    
        return { customer: null };
    }
};


const getAllCustomerService = async () => {
    try {
        
        const newCustomer = await customerModel.find();
        return { customer:newCustomer }
    } catch (error) {
        console.error(error);
    
        return { customer: null };
    }
};

const forgetInfoService = async (email,phoneNumber) => {
    try {
        const otp = generateOTP();
        await otpMail(email, otp);
        const newCustomer = new customerModel({
            otp: otp,
            email: email,
            phoneNumber
        });
        const savedCustomer = await newCustomer.save();
        console.log("Customer saved successfully:", savedCustomer);
    } catch (error) {
        console.error(error);
    }
}



// Verify OTP
const verifyOTP = async (email, otp) => {
    try {
        const user = await customerModel.findOne({ email, otp });
        if (!user) {
            throw new BadRequest('Invalid OTP.');
        }
  
        user.otp = undefined; // Clear OTP after verification
        await user.save();
    } catch (error) {
        throw new BadRequest('Failed to verify OTP.');
    }
  };
  


  const expireOTP = async (data) => {
    const { email } = data;
    await customerModel.updateOne(
      { email },
      { $unset: { otp: 1} }
    );
    return;
  };

module.exports={
    customerCreateService,
    getAllCustomerService,
    forgetInfoService,
    verifyOTP,
    expireOTP

}