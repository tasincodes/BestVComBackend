const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel=require('../Discount/model');
const { BadRequest } = require('../../utility/errors');

const { v4: uuidv4 } = require('uuid');


// Helper function to calculate total order value
const createOrder = async (orderData) => {
    try {
        // Generate orderId
        const orderId = uuidv4();

        const { customer, orderType, deliveryAddress, district, phoneNumber, paymentMethod, transactionId, products, couponId, vatRate } = orderData;

        // Validate request body
        if (!customer || !orderType || !deliveryAddress || !district || !phoneNumber || !paymentMethod || !products) {
            throw new Error('Please provide all required fields');
        }

        // Validate product IDs
        const productIds = products.map(product => product._id);
        const validProducts = await ProductModel.find({ _id: { $in: productIds } });
        if (validProducts.length !== products.length) {
            throw new Error('Invalid product IDs');
        }

        // Calculate total price
        let totalPrice = calculateOrderValue(validProducts);

        // Apply discount if coupon provided
        let discountAmount = 0;
        if (couponId) {
            const coupon = await CouponModel.findById(couponId);
            if (!coupon) {
                throw new Error('Invalid coupon ID');
            }
            discountAmount = calculateDiscount(coupon, totalPrice);
        }

        // Calculate VAT
        const vat = (vatRate / 100) * totalPrice;

        // Create new order with orderId
        const newOrder = new OrderModel({
            orderId, // Add orderId to the order object
            customer,
            orderType,
            deliveryAddress,
            district,
            phoneNumber,
            paymentMethod,
            transactionId,
            products,
            coupon: couponId ? couponId : null,
            discountAmount,
            totalPrice: totalPrice - discountAmount + vat, // Add VAT to the total price
            vatRate
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        return {
            order: savedOrder,
            totalOrderValue: totalPrice // Include total order value in the response
        };
    } catch (error) {
        throw error;
    }
}





//updateOrderByOrder ID

const updateOrder = async (orderId, orderData) => {
    try {
        // Find the order by OrderId and update it with the provided data
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, orderData, { new: true });
        return updatedOrder;
    } catch (error) {
        throw error;
    }
};


// delete OrderBy ID

const deleteOrder = async (orderId) => {
    try {
        // Find the order by OrderId and delete it
        await OrderModel.findByIdAndDelete(orderId);
    } catch (error) {
        throw error;
    }
};


const getAllOrders = async () => {
    try {
        // Find all orders
        const orders = await OrderModel.find();
        return orders;
    } catch (error) {
        throw error;
    }
};




// order manage
const acceptOrder=async (orderId, userId)=>{
    const acceptedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { orderStatus: 0 }, // Assuming 0 represents 'Order Recieved' status
        { new: true }
      );
    
      if (!acceptedOrder) {
        throw new Error('Order not found');
      }
    
      return acceptedOrder;
}




module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    acceptOrder,
};
