const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel=require('../Discount/model');
const { BadRequest } = require('../../utility/errors');

const { v4: uuidv4 } = require('uuid');

// Define calculateOrderValue function
function calculateOrderValue(products) {
    return products.reduce((total, product) => {
        if (product && product.general && typeof product.general.regularPrice === 'number') {
            return total + product.general.regularPrice;
        } else {
            console.warn('Invalid product:', product);
            return total;
        }
    }, 0);
}

// Define calculateDiscount function
function calculateDiscount(coupon, totalPrice) {
    if (!coupon) {
        return 0; // No coupon, so no discount
    }

    if (coupon.discountType === 'percentage') {
        return (coupon.couponAmount / 100) * totalPrice;
    } else if (coupon.discountType === 'fixed') {
        return coupon.couponAmount;
    } else {
        return 0; // Unknown discount type, so no discount
    }
}

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

        // Log totalPrice to debug
        console.log('Total Price:', totalPrice);

        // Apply discount if coupon provided
        let discountAmount = 0;
        if (couponId) {
            const coupon = await CouponModel.findById(couponId);
            if (!coupon) {
                throw new Error('Invalid coupon ID');
            }
            discountAmount = calculateDiscount(coupon, totalPrice);
            // Log discountAmount to debug
            console.log('Discount Amount:', discountAmount);
        }

        // Check if discountAmount is valid
        if (isNaN(discountAmount) || discountAmount < 0 || discountAmount > totalPrice) {
            throw new Error('Invalid discount amount');
        }

        // Calculate VAT
        const vat = (vatRate / 100) * totalPrice;

        // Log VAT to debug
        console.log('VAT:', vat);

        // Calculate final total price including discount and VAT
        const finalTotalPrice = totalPrice - discountAmount + vat;

        // Log finalTotalPrice to debug
        console.log('Final Total Price:', finalTotalPrice);

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
            totalPrice: finalTotalPrice, // Assign final total price
            vatRate
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        return {
            order: savedOrder,
            totalOrderValue: finalTotalPrice // Include final total order value in the response
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








const updateOrderStatus = async (orderId, newStatus) => {
    // Validate orderId format
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid orderId format');
    }
  
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        mongoose.Types.ObjectId(orderId), // Convert to ObjectId before query
        { orderStatus: newStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        throw new Error('Order not found');
      }
  
      return updatedOrder;
    } catch (error) {
      throw error; // Re-throw for proper error handling in controller
    }
  };



module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus


 
};
