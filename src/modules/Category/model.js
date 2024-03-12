const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    categoryName:{
        type:string,
        max:[30,"category name must be under 30"],
        required : true
    },
    parentCategory:{
        type : string,
        max:[30,"category name must be under 30"],
        
    },
    categorydescription:{
        type:string,
        max:[100,"product descriptiopn should be under 100 characters"]
    },
    fetaureImage:{
        type:string
        

    }

});

const categoryModel=mongoose.model('category',CategorySchema);

module.exports=categoryModel;