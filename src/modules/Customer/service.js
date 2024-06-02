const customerModel = require("../Customer/model");
const { generateOTP } = require("../../utility/common");
const { SendEmailUtility } = require("../../utility/email");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NoContent,
} = require("../../utility/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const customerCreateService = async (customerInfo) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    customerInfo.otp = otp;

    // Create new customer
    const newCustomer = await customerModel.create(customerInfo);

    // Send OTP email
    await SendEmailUtility(newCustomer.email, otp);

    return {
      message: "Customer added successfully and OTP sent",
      customer: newCustomer,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create customer: " + error.message);
  }
};

const getAllCustomerService = async () => {
  try {
    const newCustomer = await customerModel.find();
    return { customer: newCustomer };
  } catch (error) {
    console.error(error);

    return { customer: null };
  }
};

const forgetInfoService = async (email, phoneNumber) => {
  try {
    const otp = generateOTP();
    await otpMail(email, otp);
    const newCustomer = new customerModel({
      otp: otp,
      email: email,
      phoneNumber,
    });
    const savedCustomer = await newCustomer.save();
    console.log("Customer saved successfully:", savedCustomer);
  } catch (error) {
    console.error(error);
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const user = await customerModel.findOne({ email, otp });
    if (!user) {
      throw new BadRequest("Invalid OTP.");
    }
    user.isActive = true;
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification
    await user.save();
  } catch (error) {
    throw new BadRequest("Failed to verify OTP.");
  }
};

const expireOTP = async (data) => {
  const { email } = data;
  await customerModel.updateOne({ email }, { $unset: { otp: 1 } });
  return;
};

const customerSignInService = async (email, password) => {
  try {
    // Find user by email
    const user = await customerModel.findOne({ email });

    // Check if user exists
    if (!user) {
      throw new BadRequest("Invalid email or password.");
    }

    // Validate password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);

    // Check password match
    if (!isMatch) {
      throw new BadRequest("Invalid email or password.");
    }
    // Generate JWT token with user data payload
    const accessToken = jwt.sign({ user }, "SecretKey12345", {
      expiresIn: "3d",
    });
    // User is authenticated, return sanitized user data (excluding sensitive fields)
    const sanitizedUser = {
      accessToken,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: true,
      // isVerified: user.isVerified,
    };

    return sanitizedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  customerCreateService,
  getAllCustomerService,
  forgetInfoService,
  verifyOTP,
  expireOTP,
  customerSignInService,
};
