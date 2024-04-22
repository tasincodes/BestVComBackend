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



module.exports = {
    addProduct,
    updateProductById,
    getAllProducts,
    deleteProductById
}
