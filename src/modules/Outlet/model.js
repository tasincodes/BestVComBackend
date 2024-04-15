const mongoose = require('mongoose');
const OutletSchema= new mongoose.Schema({


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
    outletImage :{
        type : String,
        required:true
    }
 

},{versionKey:false});

const OutletModel=mongoose.model('outlet',OutletSchema);

module.exports=OutletModel;