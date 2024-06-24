const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../utility/common');


const brandService = require('./service');

// create Brand
const createBrandHandler = asyncHandler(async (req, res) => {
    const brand = await brandService.addBrand(req.body);
    res.status(200).json({
        message: "Brand added successfully",
        brand
    });
});

const getAllBrandsHandler = asyncHandler(async (req, res) => {
    const allBrands = await brandService.getAllBrands();
    res.status(200).json({
        message: "GetAll Brands Fetched Successfully!",
        brands: allBrands
    });
}
)


router.post('/create', createBrandHandler);
router.get('/getAll', getAllBrandsHandler);
module.exports = router;