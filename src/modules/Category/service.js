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

// getAll Categories with all associate subcategories

const getAllCategory = async () => {
    const allCategories = await Category.find();
    const categoryMap = {};

    // Create a map of all categories by their _id and initialize subCategories array
    allCategories.forEach(category => {
        categoryMap[category._id] = category.toObject();
        categoryMap[category._id].subCategories = [];
    });

    // Populate subCategories for each category
    allCategories.forEach(category => {
        if (category.parentCategory) {
            if (categoryMap[category.parentCategory]) {
                categoryMap[category.parentCategory].subCategories.push(categoryMap[category._id]);
            }
        }
    });

    const rootCategories = allCategories.filter(category => !category.parentCategory);
    const result = rootCategories.map(category => categoryMap[category._id]);

    return result;
}

// update category by ID

const updateCategoryById=async(id,value)=>{
    const category = await Category.findOneAndUpdate({_id:id},value,{
        new:true
    })
    if(!category){
        throw new BadRequest("Could not update the");         
    }
    return category;
};

// delete category By ID

const deleteCategoryById = async(id)=>{
    const category = await Category.findOneAndDelete({_id:id});
    if(!category){
        throw new BadRequest('Could not Delete category Behenchodh!')
    }
    return category;
}



const getSubcategories = async (parentCategoryId) => {
    try {
        console.log('Querying subcategories for parentCategory:', parentCategoryId); // Debugging
        const subcategories = await Category.find({ parentCategory: parentCategoryId });
        console.log('Subcategories found:', subcategories); // Debugging
        return subcategories;
    } catch (error) {
        console.error('Error while fetching subcategories:', error); // Debugging
        throw new Error('Error while fetching subcategories');
    }
};


module.exports ={
    addCategory,
    addSubcategory,
    getAllCategory,
    updateCategoryById,
    deleteCategoryById,
    getSubcategories
}