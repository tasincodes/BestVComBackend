const Product = require('../Products/model');
const { BadRequest } = require('../../utility/errors');


// addProduct

const addProduct = async (productData) => {
    const newProduct = await Product.create(productData);
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



// function generateProductCode() {
//     // Get current date in format YYYYMMDD
//     const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

//     // Dummy product counter (you might want to fetch this from a database or other source)
//     let productCounter = 1;

//     // Format the product counter with leading zeros
//     const formattedCounter = String(productCounter).padStart(4, '0');

//     // Construct the product code
//     const productCode = BEL-${formattedCounter}-${currentDate};

//     return productCode;
// }

module.exports = {
    addProduct,
    updateProductById,
    getAllProducts,
    deleteProductById
}
