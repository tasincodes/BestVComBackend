const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const { BadRequest } = require('../../utility/errors');



const createOrder=async(orderData) =>{
    try {
        const { customer, orderType, deliveryAddress, district, phoneNumber, paymentMethod, transactionId, products, couponId } = orderData;

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
        let totalPrice = calculateTotalPrice(validProducts);

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
        const vatRate = calculateVAT(orderData.vatRate, totalPrice - discountAmount);

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
            totalPrice: totalPrice - discountAmount,
            vatRate
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        return savedOrder;
    } catch (error) {
        throw error;
    }
}

// Helper function to calculate total price
function calculateTotalPrice(products) {
    return products.reduce((total, product) => total + product.general.regularPrice, 0);
}

// Helper function to calculate discount based on coupon
function calculateDiscount(coupon, totalPrice) {
    if (coupon.discountType === 'percentage') {
        return (coupon.couponAmount / 100) * totalPrice;
    } else {
        return coupon.couponAmount;
    }
}

// Helper function to calculate VAT
function calculateVAT(vatRate, totalPrice) {
    return (vatRate / 100) * totalPrice;
}



module.exports = {
    createOrder
};
