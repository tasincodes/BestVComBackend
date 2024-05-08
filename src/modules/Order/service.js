const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel=require('../Discount/model');
const { BadRequest } = require('../../utility/errors');


// service.js

// Helper function to calculate total order value
function calculateOrderValue(products) {
    return products.reduce((total, product) => total + product.general.regularPrice, 0);
}

const createOrder = async (orderData) => {
    try {
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

        // Create new order
        const newOrder = new OrderModel({
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
            vatRate,
            totalOrderValue: totalPrice
        }); 

        return await newOrder.save();
    } catch (error) {
        throw error;
    }
}

// Helper function to calculate discount based on coupon
function calculateDiscount(coupon, totalPrice) {
    if (coupon.discountType === 'percentage') {
        return (coupon.couponAmount / 100) * totalPrice;
    } else {
        return coupon.couponAmount;
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


module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders
};
