const Product = require('../Products/model');
const { BadRequest } = require('../../utility/errors');

const addProduct = async (productData) => {
    const newProduct = await Product.create(productData);
    if (!newProduct) {
        throw new BadRequest('Could Not Create Product');
    }
    return newProduct;
}

module.exports = {
    addProduct,
}
