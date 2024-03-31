const mongoose=require('mongoose');
const bcrypt=require(bcryptjs);

const CustomerSchema=new Mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true,'Email must be provided'],
    },
    firstName:{
        type:String,
        max:[15,"FirstName Should be at least 15 characters"],

    },

    lastName:{
        type:String,
        max:[12,"LastName Should be at least 12 characters"]
    },
    phoneNumber:{
        type:String,
        max:[13,"Phone Number Should be at least 13 characters"],
        required:[true,"Please Enter a valid phone number"],
        unique:true
    },
    changedPhoneNumber:{
        type:String,
        max:[14,"Phone Number Should be at least 14 characters"],
    },
    
})