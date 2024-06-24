const brandModel = require('./model');
const { BadRequest } = require('../../utility/errors');



const addBrand = async (brandData) => {
    try {
        const { name, title, description } = brandData;
        const brandExist = await brandModel.findOne({ name });
        if (brandExist) {
            throw new BadRequest('Brand already exists');
        }
        const newBrand = await brandModel.create({
            name,
            title,
            description
        });
        return newBrand;
    } catch (err) {
        console.log(err);
    }
}

const getAllBrands = async () => {
    try {
        const allBrands = await brandModel.find();
        return allBrands;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    addBrand,
    getAllBrands

};