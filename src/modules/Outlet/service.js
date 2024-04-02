const OutletModel = require("./model")
const userModel = require("../User/model")


const fetchOutletManager = async(data,outletManagerId)=>{

      const{ outletName,outletLocation,phoneNumber,email }= data.body
    try{
        const outletManager = await userModel.findById(outletManagerId)
        console.log(outletManager)
        if(!user){
            return "User not found"
        }
        const newOutletManager = OutletModel.create({
            userId:outletManager._id,
            outletName: outletName,
            outletLocation : outletLocation,
            phoneNumber : phoneNumber,
            email : email
        })
        return newOutletManager;

    }
    catch(error){
        console.log(error)
    }

}


module.exports= {
    fetchOutletManager
}
