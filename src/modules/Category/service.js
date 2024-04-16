const Category=require('../Category/model');
const { BadRequest}=require('../../utility/errors');






// create Category 
const addCategory = async (categoryData) => {
    const newCategory = await Category.create(categoryData);
    if(!newCategory){
        throw new BadRequest("Could not found category");
    }
    return newCategory;
};



// create Subcategory

const addSubcategory = async (subcategoryData) => {
    const newSubcategory = await Category.create(subcategoryData);
    if(!newSubcategory){
        throw new BadRequest("Could not find Parnet category");
    }
    return newSubcategory;
};




const getAllCategory = async () => {
    const allCategories = await Category.find();
    return allCategories;
};




module.exports ={
    addCategory,
    addSubcategory,
    getAllCategory
}