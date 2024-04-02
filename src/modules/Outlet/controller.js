const express = require("express");
const router = express.Router();
const outletService = require('./service');


const outletManagerCreate = async (req,res,next)=>{

    try{
        const outletManagerId = req.params.id;
        console.log("twest")
        const outletManager = await outletService.fetchOutletManager(req,outletManagerId)
        if(!outletManager){
            res.status(401).json({message:"outlet manger not found"})
        }
        return outletManager
    }
    catch(error){
        console.log(error)
    }

}


router.post("/outletManagerCreate",outletManagerCreate);



module.exports = router;


