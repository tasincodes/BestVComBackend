const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'category'
  },
  productName: {
    type: String,
    maxlength: 300, // Use `maxlength` for character limit validation
    required: true
  },
  productImages: {
    type: [String], // Array to store multiple image URLs
  },
  productVideos: {
    type: [String], // Array to store multiple video URLs
  },
  productDescription: {
    type: String,
    maxlength: 3000, // Use `maxlength` for character limit validation
  },
  productShortDescription: {
    type: String,
    maxlength: 2000, // Use `maxlength` for character limit validation
  },
  productTags: {
    type: String,
    maxlength: 200, // Use `maxlength` for character limit validation
  },
  general: { // Subdocument for general fields
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
      type: Date // Store end date for sales
    },
    taxStatus: {
      type: String, // Define tax status options (e.g., "taxable", "exempt")
    },
    taxClass: {
      type: String // Define tax class categories
    }
  },

  
});

module.exports = mongoose.model('Product', ProductSchema);