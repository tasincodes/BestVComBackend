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


const updateOutlet = asyncHandler(async(req, res) => {

    const outlet=await outletService.updateOutlet(req.params.id,req.body);
    res.status(200).json({
        outlet
    })
  });

  
const deleteOutlet = asyncHandler(async(req, res) => {

    await outletService.deleteOutlet(req.params.id);
    res.status(200).json({message:"outlet deleted success"
    })
  });
  

const searchOutlet = async(req,res)=>{
    const searchInfo = await outletService.searchOutlet(req.query.outletName.split(","));
    console.log(searchInfo)
    if(!searchInfo){
        res.status(401).json({message:"couldnt get search info"})
    }
    res.status(200).json({message:"searching success",searchInfo:searchInfo})
}













router.post("/outletManagerCreate", outletCreate);
router.get("/getAllOutlet", getAllOutlet);
router.put("/updateOutlet/:id",updateOutlet)
router.delete("/deleteOutlet/:id",deleteOutlet)
router.get("/searchOutlet",searchOutlet)
module.exports = router;
