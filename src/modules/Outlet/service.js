const OutletModel = require("./model");
const userModel = require("../User/model");
const{passEmailForOutlet}=require('../../utility/email');
const jwt = require('jsonwebtoken');



const outletCreateService = async (outletName, outletLocation,outletImage) => {
    try {
        
        const newOutlet = await OutletModel.create({
            outletName,
            outletLocation,
            outletImage : outletImage
        });
        return { outlet: newOutlet}
    } catch (error) {
        console.error(error);
    
        return { outlet: null };
    }
};

const getAllUsers=async(data)=>{
    const user=await OutletModel.find();
    return user;
}

const updateOutlet=async(userId,updatedInfo)=>{
    try {
      const updatedResult = await OutletModel.findByIdAndUpdate(
        userId,
        updatedInfo,
      { new: true }
       );
       if (!updatedResult) {
        throw new Error('Outlet info to update not found');
      }
    
      return updatedResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  const deleteOutlet =async(id)=>{
    try{
        const deletedResult = await OutletModel.findByIdAndDelete(id)
        if (!deletedResult) {
            throw new Error('couldnt get deleted info');
          }
    }
    catch(error){
        throw new Error(error);
    }
  }
const searchOutlet = async(outletName)=>{
    try{
const searchedOutlet = await OutletModel.find({ outletName: { $in: outletName }})
if(!searchedOutlet){
    throw new Error('Search Result not found');
}



return searchedOutlet
    }
    catch(error){
    throw error
    }
}



  

module.exports = {
    outletCreateService,
    getAllUsers,
    updateOutlet,
    deleteOutlet,
    searchOutlet,
};
