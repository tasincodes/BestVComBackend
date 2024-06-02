const express = require("express");
const router = express.Router();
const outletService = require('./service');
const { asyncHandler } = require('../../utility/common');
const multerMiddleware = require('../../middlewares/multerMiddleware');

const outletCreate = asyncHandler(async (req, res, next) => {
  try {
      const { outletName, outletLocation, branchAdmin } = req.body;
      const outletImage = req.files['outletImage'] ? `/uploads/${req.files['outletImage'][0].filename}` : '';
      
      const createdOutlet = await outletService.outletCreateService(outletName, outletLocation, outletImage, branchAdmin);
      
      if (createdOutlet) {
          res.status(200).json({ createdOutlet });
      } else {
          res.status(401).json({ message: "Outlet creation failed" });
      }
  } catch (error) {
      next(error);
  }
});



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
    if(!searchInfo){
        res.status(401).json({message:"couldnt get search info"})
    }
    res.status(200).json({message:"searching success",searchInfo:searchInfo})
}


const outletEmailSetPassword = async (req,res)=>{
    try{
    const {email,token}= req.body;
    const emailInfo = await outletService.passEmailForOutlet(email,token)
    if(!emailInfo){res.status(401).json({message:"emailinfo not found from service"})}
    }
    catch(error){
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



const getOutletManagerById = asyncHandler(async(req, res) => {

  const managerInfo = await outletService.getOutletManagerByIdService(req.params.id);
  res.status(200).json({message:"outlet manager found",managerInfo
  })
});




router.post("/outletCreate",  multerMiddleware.upload.fields([
  { name: 'outletImage', maxCount: 1 }
]),outletCreate);
router.get("/getAllOutlet", getAllOutlet);
router.put("/updateOutlet/:id",updateOutlet)
router.delete("/deleteOutlet/:id",deleteOutlet)
router.get("/searchOutlet",searchOutlet)
router.post("/outletEmailSetPassword",outletEmailSetPassword)
router.get("/getOutletManagerById/:id",getOutletManagerById)




module.exports = router;
