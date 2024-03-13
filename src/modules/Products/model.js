const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'category'
  },
  productName: {
    type: String,
    maxlength: 300, 
    required: true
  },
  productImages: {
    type: [String], 
  },
  productVideos: {
    type: [String], 
  },
  productDescription: {
    type: String,
    maxlength: 3000, 
  },
  productShortDescription: {
    type: String,
    maxlength: 2000, 
  },
  productTags: {
    type: String,
    maxlength: 200, 
  },
  general: { 
    regularPrice: {
      type: Number,
      required: true
    },
    salePrice: {
      type: Number
    },
    salesStart: {
      type: Date // Store start date for sales
    },
    salesEnd: {
      type: Date 
    },
    taxStatus: {
      type: String, 
    },
    taxClass: {
      type: String // Define tax class categories
    }
  },
  inventory:{
    sku:{
      type:String
    },
    stockManagement:{
      type:Boolean
    },
    stockStatus:{
      type: String,
      enum:['In stock','out of stock','on backorder']
    },
    soldIndevidually:{
      type:Boolean
    }
  },
  shipping:{
    weight:{
      type:Number,
      required:true
    },
    productDimensions: {
      length: {
          type: Number,
          required: true
      },
      width: {
          type: Number,
          required: true
      },
      height: {
          type: Number,
          required: true
      }
  },
  
  taxClass: {
    type: String,
    enum: ['No shipping class'] 
  }

  }




});

module.exports = mongoose.model('Product', ProductSchema);