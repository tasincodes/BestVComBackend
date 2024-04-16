const express=require('express');
const router=express.Router();
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } =require('../../utility/common');
const categoryService=require('./service');


const {
    HEAD_OFFICE, 
    BRANCH_ADMIN,
    CUSTOMER
}=require('../../config/constants');




// create Category
const createCategoryHandler = asyncHandler(async (req, res) => {
    const category = await categoryService.addCategory(req.body);
    res.status(200).json({
        message: "Category added successfully",
        category
    });
});


//create Subcategory
const createSubCategoryHandler = asyncHandler(async (req, res) =>{
    const newSubcategory = await categoryService.addSubcategory(req.body);
    res.status(200).json({
        message:"Subcategory added successfully added",
        newSubcategory
    })
});


// getAllSubcatgories

const getAllCategoriesHandler = asyncHandler(async (req, res) => {
    const getAllCategories = await categoryService.getAllCategory();
    res.status(200).json({
        message: "GetAll Categories Fetched Successfully !",
        getAllCategories
    });
});





router.post('/addCategory',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),createCategoryHandler);
router.post('/addSubCategory',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),createSubCategoryHandler);
router.get('/getAllCat',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),getAllCategoriesHandler);
module.exports = router;