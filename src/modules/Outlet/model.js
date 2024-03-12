const mongoose = require('mongoose');
const OutletSchema= new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },

    outletName:{
        type:String,
        max:[30,'Must Be Outlet Name in 30 characters'],
        required:true
    },
    outletLocation:{
        type:String,
        max:[100,'Must Be Outlet Location in 100 characters'],
        required:true
    },
    phoneNumber:{
        type:String,
        max:[12,'Must Be Phone Number in 12 characters'],
        required:true,
    },
    email:{
        type:String,
        max:[40,'Must Be Email in 12 characters'],
        required:true,
       
    }


});

const OutletModel=mongoose.model('outlet',OutletSchema);

module.exports=OutletSchema;