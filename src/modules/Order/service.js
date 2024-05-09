const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel=require('../Discount/model');
const { BadRequest } = require('../../utility/errors');

const { v4: uuidv4 } = require('uuid');


// Define calculateOrderValue function
function calculateOrderValue(products) {
    return products.reduce((total, product) => total + product.general.regularPrice, 0);
}

// Define calculateDiscount function
function calculateDiscount(coupon, totalPrice) {
    if (coupon.discountType === 'percentage') {
        return (coupon.couponAmount / 100) * totalPrice;
    } else {
        return coupon.couponAmount;
    }
}

// Your createOrder function
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
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('No products provided');
        }

        const productIds = products.map(product => product._id);
        const validProducts = await ProductModel.find({ _id: { $in: productIds } });

        if (validProducts.length !== products.length) {
            throw new Error('Invalid product IDs');
        }

        // Calculate total price using calculateOrderValue function
        let totalPrice = calculateOrderValue(validProducts);
        
        if (isNaN(totalPrice) || totalPrice <= 0) {
            throw new Error('Invalid total price');
        }

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
        console.log("vat",vat)

        // Create new order
        const newOrder = new OrderModel({
            orderId,
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

        console.log(savedOrder)

        return {
            order: savedOrder,
            totalOrderValue: totalPrice // Include total order value in the response
           
        };
        console.log(totalOrderValue);
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
