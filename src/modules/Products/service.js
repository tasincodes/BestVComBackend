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



module.exports = {
    addProduct,
    updateProductById
}
