const Category = require("../Category/model");
const { BadRequest } = require("../../utility/errors");

// create Category
const addCategory = async (categoryData) => {
  const newCategory = await Category.create(categoryData);
  if (!newCategory) {
    throw new BadRequest("Could not found category");
  }
  return newCategory;
};

// create Subcategory

const addSubcategory = async (subcategoryData) => {
  const newSubcategory = await Category.create(subcategoryData);
  if (!newSubcategory) {
    throw new BadRequest("Could not find Parnet category");
  }
  return newSubcategory;
};

const getAllCategory = async () => {
  const allCategories = await Category.find();
  return allCategories;
};

// update category by ID

const updateCategoryById = async (id, value) => {
  const category = await Category.findOneAndUpdate({ _id: id }, value, {
    new: true,
  });
  if (!category) {
    throw new BadRequest("Could not update the");
  }
  return category;
};

// delete category By ID

const deleteCategoryById = async (id) => {
  const category = await Category.findOneAndDelete({ _id: id });
  if (!category) {
    throw new BadRequest("Could not Delete category Behenchodh!");
  }
  return category;
};

module.exports = {
  addCategory,
  addSubcategory,
  getAllCategory,
  updateCategoryById,
  deleteCategoryById,
};
