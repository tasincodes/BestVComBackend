const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel = require('../Discount/model');
const { BadRequest, NotFound } = require('../../utility/errors');
const CustomerModel = require('../Customer/model');

const { generateCustomOrderId, formatOrderTime } = require('../../utility/customOrder');



const sendSMS = require('../../utility/aamarPayOTP'); // Adjust the path as per your file structure
const { getSMSText } = require('../../utility/getSMS'); // Adjust the path as per your file structure




function calculateOrderValue(products, orderProducts) {
  return orderProducts.reduce((total, orderProduct) => {
    const product = products.find(p => p._id.equals(orderProduct._id));
    if (product && product.general && typeof product.general.regularPrice === 'number' && orderProduct.quantity && typeof orderProduct.quantity === 'number') {
      return total + (product.general.regularPrice * orderProduct.quantity);
    } else {
      console.warn('Invalid product or quantity:', orderProduct);
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
    // Generate custom orderId and orderTime
    const orderId = await generateCustomOrderId();
    const orderTime = formatOrderTime(new Date());

    // Destructure orderData
    const { 
      email, orderType, deliveryAddress, deliveryCharge = 0, 
      district, phoneNumber, paymentMethod, transactionId, 
      products, couponId, vatRate, firstName, lastName, customerIp 
    } = orderData;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No products provided');
    }

    // Ensure each product has a valid _id
    for (const product of products) {
      if (!product._id || typeof product._id !== 'string') {
        throw new Error('Invalid product ID');
      }
    }

    // Calculate total price
    let totalPrice = calculateOrderValue(products); // Adjust as per your calculation method

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

    // Calculate final total price including discount and VAT
    const finalTotalPrice = totalPrice - discountAmount + vat + deliveryCharge;

    // Create new order
    const newOrder = new OrderModel({
      orderId,
      customer: customer._id,
      firstName,
      lastName,
      orderType,
      orderTime,
      deliveryAddress,
      orderStatus: 'Received', 
      district,
      phoneNumber,
      paymentMethod,
      transactionId,
      products, // Use products array directly
      coupon: couponId ? couponId : null,
      discountAmount,
      totalPrice: finalTotalPrice, 
      vatRate,
      deliveryCharge,
      customerIp
    });

    const savedOrder = await newOrder.save();

    // Assuming sendSMS function is correctly implemented
    const smsText = getSMSText('Received', `${firstName} ${lastName}`, {
      orderId: savedOrder.orderId,
      products: savedOrder.products,
      totalPrice: savedOrder.totalPrice,
      discountAmount: savedOrder.discountAmount
    });

    await sendSMS(phoneNumber, smsText);

    return {
      message: "Order created successfully",
      createdOrder: {
        order: savedOrder,
        customerEmail: email,
        totalOrderValue: finalTotalPrice 
      }
    };

  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};














//updateOrderByOrder ID

const updateOrder = async (orderId, orderData) => {

  // Find the order by OrderId and update it with the provided data
  const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, orderData, { new: true });
  return updatedOrder;

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
    const orders = await OrderModel.find().populate({
      path: 'products._id',
      model: 'Product',
      select: 'productName productImage general.regularPrice inventory.sku general.salePrice'
    }).populate({
      path: 'customer',
      model: 'customer',
      select: 'email phoneNumber district address'
    });

    const formattedOrders = orders.map(order => {
      return {
        ...order.toObject(),
        customerFirstName: order.customer.firstName,
        customerLastName: order.customer.lastName,
        products: order.products.map(productItem => {
          const productDetails = productItem._id;
          return productDetails ? {
            _id: productDetails._id,
            productName: productDetails.productName,
            productImage: productDetails.productImage,
            sku: productDetails.inventory.sku,
            quantity: productItem.quantity,
            price: productDetails.general.regularPrice,
            offerPrice: productDetails.general.salePrice,
            totalPrice: productDetails.general.salePrice * productItem.quantity,
          } : null;
        }).filter(product => product !== null),
        customer: order.customer ? {
          _id: order.customer._id,
          email: order.customer.email,
          phoneNumber: order.customer.phoneNumber,
          district: order.customer.district,
          address: order.customer.address,
        } : null,
      };
    });

    return formattedOrders;
  } catch (error) {
    console.error("Error retrieving orders:", error);
    throw error;
  }
};










// Update Order Status
const updateOrderStatus = async (id, updateOrder) => {
  const { orderStatus } = updateOrder;

  const order = await OrderModel.findByIdAndUpdate({ _id: id }, updateOrder, {
    new: true,
  });

  if (!order) throw new NotFound("Order not found");

  const isLogged = order.orderLogs.find(
    (log) => log.status === Number(orderStatus)
  );

  if (!isLogged) {
    order.orderLogs.push({
      status: Number(orderStatus),
      createdAt: new Date(),
    });

    await order.save();

  }
}




const getOrderById = async (id) => {
  try {

    const orderInfo = await OrderModel.findById(id)
      .populate({
        path: 'products._id',
        model: 'Product',
        select: 'productName productImage general.regularPrice inventory.sku general.salePrice'
      })
      .populate({
        path: 'customer',
        model: 'customer',
        select: 'firstName lastName email phoneNumber district address'
      });

    if (!orderInfo) {
      throw new NotFound("Order not found");
    }

    const formattedOrder = {
      ...orderInfo.toObject(),
      products: orderInfo.products.map(productItem => {
        const productDetails = productItem._id;
        if (!productDetails) {
          console.warn('Product not found:', productItem);
          return null;
          
        }
        return {
          _id: productDetails._id,
          productName: productDetails.productName,
          productImage: productDetails.productImage,
          sku: productDetails.inventory.sku,
          quantity: productItem.quantity,
          price: productDetails.general.regularPrice,
          offerPrice: productDetails.general.salePrice,
          totalPrice: productDetails.general.salePrice * productItem.quantity,
        };
      }),
      customer: orderInfo.customer ? {
        _id: orderInfo.customer._id,
        firstName: orderInfo.customer.firstName,
        lastName: orderInfo.customer.lastName,
        email: orderInfo.customer.email,
        phoneNumber: orderInfo.customer.phoneNumber,
        district: orderInfo.customer.district,
        address: orderInfo.customer.address,
      } : null,
    };

    return { success: true, order: formattedOrder };
  } catch (error) {
    console.error('Error in getOrderById:', error.message);
    return { success: false, error: error.message };
  }
};




const getCustomerHistory = async (customerId) => {
  try {
    const orderInfo = await OrderModel.find({ customer: customerId });
    const totalOrders = orderInfo.length;
    let totalOrderValue = 0;
    for (const order of orderInfo) {
      totalOrderValue += order.totalPrice;
    }
    const averageOrderValue = totalOrderValue / totalOrders;
    return { totalOrders, averageOrderValue };
  } catch (error) {
    console.error('Error in getCustomerHistory:', error.message);
    throw error;
  }
}








// update OrderNoteStatus

const updateOrderNoteById = async (orderId, orderNote) => {

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId },
    { $set: { orderNote } },
    { new: true } // To return the updated document
  );

  if (!updatedOrder) {
    throw new NotFound("Order not found");
  }

  return { success: true, order: updatedOrder };

};


module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getCustomerHistory,
  updateOrderNoteById
};
