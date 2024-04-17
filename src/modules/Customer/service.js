const CustomerModel = require("../Customer/model");
const customerModel = require("../Customer/model")
const {generateOTP}=require('../../utility/common');
const {otpMail} = require('../../utility/email')


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

const forgetInfoService = async (email) => {
    try {
        const otp = generateOTP();
        await otpMail(email, otp); // Call the otpMail function with email and otp
    } catch (error) {
        console.error(error);
    }
}


module.exports={
    customerCreateService,
    getAllCustomerService,
    forgetInfoService

}