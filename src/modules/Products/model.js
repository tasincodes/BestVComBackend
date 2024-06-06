const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Category' // Assuming  category model is named 'Category'
  },
  productName: {
    type: String,
    maxlength: 300,
    required: true
  }, 
  productCode: {
    type: String,
    
  },
  productImage: {
    type :String
  },
  productGallery:[String],
  productVideos: [String],
  isTrash:{
    type:Boolean
  },
  productDescription: {
    type: String,
    maxlength: 3000
  },
  seo: {
    productTitle: {
      type: String,
      maxlength: 100
    },
    prodDescription: {
      type: String,
      maxlength: 100
    },
    productShortDescription: {
      type: String,
      maxlength: 2000
    },
    productTags: {
      type: String,
      maxlength: 200
    },
    productNotes: {
      type: String,
      maxlength: 1000
    }
  },
  general: {
    regularPrice: {
      type: Number,
      required: true
    },
    
    salePrice: Number,
    salesStart: Date,
    salesEnd: Date,
    taxStatus: String,
    taxClass: String,
  
  },
  inventory: {
    sku: String,
    stockManagement: Boolean,
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Out of stock', 'On Backorder']
    },
    soldIndividually: Boolean,
    inventoryStatus:{
      type: String,
      enum: ['Only Online', 'Only Offline', 'Online & Offline']
    }
  },
  shipping: {
    productDimensions: {
      height: Number,
      width: Number,
      length: Number
    },
    weight: Number
  }
});


const ProductModel=mongoose.model('Product', ProductSchema);

module.exports = ProductModel;