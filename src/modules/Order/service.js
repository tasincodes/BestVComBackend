const OrderModel = require('../Order/model');
const ProductModel = require('../Products/model');
const CouponModel = require('../Discount/model');
const { BadRequest, NotFound } = require('../../utility/errors');
const CustomerModel = require('../Customer/model');
const { v4: uuidv4 } = require('uuid');
const settingModel = require('../settings/model');
const {SendEmailUtilityForAdmin} = require('../../utility/email');

const { generateCustomOrderId, formatOrderTime } = require('../../utility/customOrder');



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

    // Validate request body
    if (!email || !orderType || !deliveryAddress || !district || !phoneNumber || !paymentMethod || !products || !firstName || !lastName || !customerIp) {
      throw new Error('Please provide all required fields');
    }

    // Find the customer by email
    const customer = await CustomerModel.findOne({ email });
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No products provided');
    }

    for (const product of products) {
      if (!product.quantity || typeof product.quantity !== 'number') {
        throw new Error('Each product must have a valid quantity');
      }
    }

    const productIds = products.map(product => product._id);
    const validProducts = await ProductModel.find({ _id: { $in: productIds } });

    if (validProducts.length !== products.length) {
      throw new Error('Invalid product IDs');
    }

    // Calculate total price
    let totalPrice = calculateOrderValue(validProducts, products);

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
<<<<<<< HEAD
      orderStatus: 'Received', 
=======
      orderStatus: 'Received',
>>>>>>> origin/development
      district,
      phoneNumber,
      paymentMethod,
      transactionId,
      products,
      coupon: couponId ? couponId : null,
      discountAmount,
<<<<<<< HEAD
      totalPrice: finalTotalPrice, 
=======
      totalPrice: finalTotalPrice,
>>>>>>> origin/development
      vatRate,
      deliveryCharge,
      customerIp
    });
    const savedOrder = await newOrder.save();

    // Retrieve email settings for 'newOrder' status
    const newOrderMailReciepent = await settingModel.findOne({ 'emails.emailStatus': 'newOrder' });
    if (newOrderMailReciepent && newOrderMailReciepent.emails && newOrderMailReciepent.emails.enable) {
      const { emailReciepent, subject, emailBody, emailHeader, emailType, emailTemplate } = newOrderMailReciepent.emails;

      // Format the product details into a HTML table
      const productsTable = products.map(product => {
        const productDetails = validProducts.find(p => p._id.equals(product._id));
        return `
          <tr>
            <td>${productDetails.productName}</td>
            <td>${product.quantity}</td>
            <td>${productDetails.general.regularPrice}</td>
            <td>${product.quantity * productDetails.general.regularPrice}</td>
          </tr>
        `;
      }).join('');

      // Construct the email body with the template and order details
      const fullEmailBody = `
        <div style="background-color: ${emailTemplate.backgroundColor}; color: ${emailTemplate.bodyTextColour}; padding: 20px;">
          <div style="text-align: center;">
            <img src="${emailTemplate.headerImage}" alt="Header Image" style="max-width: 100%;">
          </div>
          <h1>${emailHeader}</h1>
          <div>${emailBody}</div> 
          <div>
            <h2>Order Details</h2>
            <p>Order ID: ${orderId}</p>
            <p>Order Time: ${orderTime}</p>
            <p>Customer Name: ${firstName} ${lastName}</p>
            <p>Delivery Address: ${deliveryAddress}, ${district}</p>
            <h3>Products:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Unit Price</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total Price</th>
              </tr>
              ${productsTable}
            </table>
            <p>Total Price: ${totalPrice}</p>
            <p>Discount: ${discountAmount}</p>
            <p>VAT: ${vat}</p>
            <p>Delivery Charge: ${deliveryCharge}</p>
            <p><strong>Final Total Price: ${finalTotalPrice}</strong></p>
          </div>
          <div>${emailTemplate.footerText}</div>
        </div>
      `;

      await SendEmailUtilityForAdmin(emailReciepent.join(','), fullEmailBody, subject, emailType);
    } else {
      console.warn("No email settings found for 'newOrder' or email notifications are disabled");
    }

    return {
      message: "Order created successfully",
      createdOrder: {
        order: savedOrder,
        customerEmail: customer.email,
        totalOrderValue: finalTotalPrice 
      }
    };

  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};




<<<<<<< HEAD


=======
>>>>>>> origin/development
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
