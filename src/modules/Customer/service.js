const customerModel = require("../Customer/model")



const customerCreateService = async (customerInfo) => {
    try {
        
        const newCustomer = await customerModel.create(customerInfo);
        return { customer:newCustomer }
    } catch (error) {
        console.error(error);
    
        return { customer: null };
    }
};

module.exports={
    customerCreateService

}