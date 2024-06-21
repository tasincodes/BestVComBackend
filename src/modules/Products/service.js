const Product = require('../Products/model');
const { BadRequest } = require('../../utility/errors');


// addProduct

const addProduct = async (productData) => {
    const productCode = await generateProductCode(Product);
    const newProduct = await Product.create({ ...productData, productCode }); // Combine productData and productCode directly
    if (!newProduct) {
      throw new BadRequest('Could Not Create Product');
    }
    return newProduct;
}


//Edit Product

const updateProductById =async(id,value)=>{
    const products= await Product.findByIdAndUpdate({_id:id},value,{
        new:true,
    })

    if(!products){
        throw new BadRequest('Could Not Update the Product');
    }
    return products
}



// getAllProducts

const getAllProducts= async()=>{
    const products= await Product.find();
    return products;

}





const deleteProductById = async (id) => {
    const product = await Product.findByIdAndDelete({_id:id});
    if (!product) {
      throw new BadRequest('Could not delete product');
    }
    return product;
  }
  

  
// generate Product Codes
async function generateProductCode(Product) {
    try {

      const productCount = await Product.countDocuments();
  
      const productNumber = productCount + 1;
  
      // Format the product number with leading zeros
      const formattedProductNumber = String(productNumber).padStart(4, '0');
  
      // Get the current date in the format YYYYMMDD
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
      // Construct the product code
      const productCode = `BEL-${formattedProductNumber}-${currentDate}`;
  
      return productCode;
    } catch (error) {
      console.error('Error generating product code:', error);
      throw new Error('Failed to generate product code');
    }
  }
  



  const getProductByIdService = async(id)=>{
    try {
        const product = await Product.findById({_id:id}) ;
        return {success:true, data :product };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to retreive products by code' };
    }
  }



  const getProductByCategoryId = async (categoryId) => {
    try {
      const products = await Product.find({ categoryId });
      if(!products){
        throw new Error('Products not found');
      }
      return products;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve products by category');
    }
  }






module.exports = {
    addProduct,
    updateProductById,
    getAllProducts,
    deleteProductById,
    getProductByIdService,
    getProductByCategoryId
}
