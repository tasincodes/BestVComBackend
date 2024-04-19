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
    
})


router.post('/addProduct', authMiddleware, roleMiddleware([HEAD_OFFICE, BRANCH_ADMIN]), addProductHandler);

module.exports = router;
