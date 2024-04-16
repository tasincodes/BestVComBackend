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

// Update CategoryBy ID

const updateCategoryHandler = asyncHandler(async (req, res) =>{
    const {id}=req.params;
    const updateCategory = await categoryService.updateCategoryById(id,req.body);
    res.status(200).json({
        message:"Update Category Successfully",
        updateCategory
    })
})






router.post('/addCategory',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),createCategoryHandler);
router.post('/addSubCategory',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),createSubCategoryHandler);
router.get('/getAllCat',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),getAllCategoriesHandler);
router.put('/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),updateCategoryHandler);
module.exports = router;