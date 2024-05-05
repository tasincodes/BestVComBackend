const Product = require('../Products/model');
const { BadRequest } = require('../../utility/errors');


// addProduct

const addProduct = async (productData) => {
    const productCode = await generateProductCode(Product);
    console.log(productCode);
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



const deleteProductById = async(id)=>{
    const products = await Product.findOneAndDelete({_id:id});
    if(!products){
        throw new BadRequest('Could not Delete Products Behenchodh!')
    }
    return products;
}

async function generateProductCode(Product) {
    // Get current date in format YYYYMMDD
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    try {
        // Fetch the latest product (handles empty array case)
        const latestProduct = await Product.findOne().sort({ _id: -1 }); // Use findOne instead of find
        
        let productCounter;
        if (latestProduct) {
          const latestCode = latestProduct.productCode;
          const [, currentCounter] = latestCode.split('-'); // Extract counter from code format
          productCounter = parseInt(currentCounter, 10) + 1; // Increment the counter
        } else {
          productCounter = 1; // Start with 1 if no existing products
        }
        const formattedCounter = String(productCounter).padStart(4, '0');

        // Construct the product code
        const productCode = `BEL-${formattedCounter}-${currentDate}`;
    
        // Optionally, update the product counter in the database for future generations
        // await productModel.create({ productCode });  // Example of creating a record with the code for tracking
    
        return productCode;
    
      } catch (err) {
        console.error('Error generating product code:', err);
      }
}


module.exports = {
    addProduct,
    updateProductById,
    getAllProducts,
    deleteProductById
}
