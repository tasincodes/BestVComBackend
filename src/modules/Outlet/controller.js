const express = require("express");
const router = express.Router();
const outletService = require('./service');
const { asyncHandler } = require('../../utility/common');
const multer = require("multer");

const outletCreate = async (req, res, next) => {
    try {
        
        const { outletName, outletLocation, outletImage,branchAdmin} = req.body;

       
        const createdOutlet = await outletService.outletCreateService(outletName, outletLocation, outletImage,branchAdmin);

        if (createdOutlet) {
            res.status(200).json({ createdOutlet });
        }
        else{
        res.status(401).json({ message: "Outlet manager not found" });
        }
    } catch (error) {
 
        next(error);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/modules/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  

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




router.post("/outletCreate", outletCreate);
router.get("/getAllOutlet", getAllOutlet);
router.put("/updateOutlet/:id",updateOutlet)
router.delete("/deleteOutlet/:id",deleteOutlet)
router.get("/searchOutlet",searchOutlet)
router.post("/outletEmailSetPassword",outletEmailSetPassword)
router.get("/getOutletManagerById/:id",getOutletManagerById)



router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
      const uploadedFile = req.file;
      if (uploadedFile) {
        res
          .status(200)
          .json({ message: "File uploaded successfully", file: uploadedFile });
      } else {
        res.status(401).json({ message: "File not uploaded" });
      }
    } catch (error) {
      next(error);
    }
  });
module.exports = router;
