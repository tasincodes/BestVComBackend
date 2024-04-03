const OutletModel = require("./model");
const userModel = require("../User/model");

const fetchOutletManager = async (userId, outletName, outletLocation, phoneNumber, email) => {
    try {
        
        const outletManager = await userModel.findById(userId);

        if (!outletManager) {
            return null;
        }
        const newOutlet = await OutletModel.create({
            userId: outletManager._id,
            outletName,
            outletLocation,
            phoneNumber,
            email,
        });

        return newOutlet;
    } catch (error) {
        console.error(error);
    
        return null;
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
    fetchOutletManager,
    getAllUsers,
    updateOutlet,
    deleteOutlet,
    searchOutlet
};
