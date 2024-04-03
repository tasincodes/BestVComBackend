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











module.exports = {
    fetchOutletManager,
    getAllUsers
};
