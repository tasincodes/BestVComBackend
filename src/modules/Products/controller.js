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
const getProductByIdHandler = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const{success,data,error}= await productService.getProductByIdService(id);
    if(success){
        res.status(200).json({message:"Product found success",data:data})
    }
    else{
        res.status(500).json({message:"fetchin product error",error:error})
    }
})



const getProductByCategoryIdHandler = asyncHandler(async(req,res)=>{
    const {categoryId}=req.params;
    console.log("categoryId",categoryId);
    const products = await productService.getProductByCategoryId(categoryId);
    res.status(200).json({
        message:"Get AllProducts Fetched Successfully!",
        products
    })
})




router.post('/addProduct', authMiddleware, roleMiddleware([HEAD_OFFICE, BRANCH_ADMIN]), addProductHandler);
router.put('/updateProduct/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),updateProductByIdHandler);
router.get('/getAllProducts',getAllProductsHandler)
router.delete('/deleteProduct/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),deleteProductHandler);
router.get('/getProductById/:id',authMiddleware,roleMiddleware([HEAD_OFFICE,BRANCH_ADMIN]),getProductByIdHandler);
router.get('/getProductByCategoryId/:categoryId',getProductByCategoryIdHandler);

module.exports = router;
