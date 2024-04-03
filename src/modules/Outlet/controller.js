const express = require("express");
const router = express.Router();
const outletService = require('./service');
const { asyncHandler } = require('../../utility/common');

const outletCreate = async (req, res, next) => {
    try {
        
        const { userId, outletName, outletLocation, phoneNumber, email } = req.body;

       
        const createdOutlet = await outletService.fetchOutletManager(userId, outletName, outletLocation, phoneNumber, email);

        if (createdOutlet) {
            res.status(200).json({ createdOutlet });
        }
        return res.status(401).json({ message: "Outlet manager not found" });
     
    } catch (error) {
 
        next(error);
    }
};


const getAllOutlet = asyncHandler(async(req, res) => {
    const outlet=await outletService.getAllUsers();
    res.status(200).json({
        outlet
    })
  });
  












router.post("/outletManagerCreate", outletCreate);
router.get("/getAllOutlet", getAllOutlet);
module.exports = router;
