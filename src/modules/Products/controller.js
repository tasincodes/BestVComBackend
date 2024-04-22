const express = require('express');
const router = express.Router();
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');
const productService = require('./service');
const { HEAD_OFFICE, BRANCH_ADMIN } = require('../../config/constants');






// addProducts

const addProductHandler = asyncHandler(async (req, res) => {
    const product = await productService.addProduct(req.body);
    res.status(200).json({
        message: "Product added successfully!",
        product
    })
});



// editProducts

const updateProductByIdHandler = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const editProducts = await productService.updateProductById(id,req.body);
    res.status(200).json({
        message:"Product Updated Successfully!",
        editProducts
    });
    
});


// getAllProducts

const getAllProductsHandler = asyncHandler(async(req,res)=>{
    const products = await productService.getAllProducts();
    res.status(200).json({
        message:"Get AllProducts Fetched Successfully!",
        products
    })
})


const deleteProductHandler=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const deleteProduct = await productService.deleteProductById(id,req.body);
    res.status(200).json({
        message:"Delete Category Successfully!",
        deleteProduct
    })
})


router.post('/addProduct', authMiddleware, roleMiddleware([HEAD_OFFICE, BRANCH_ADMIN]), addProductHandler);
router.put('/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),updateProductByIdHandler);
router.get('/getAllProds',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),getAllProductsHandler)
router.delete('/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),deleteProductHandler);

module.exports = router;
