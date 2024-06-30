const getSMSText = (orderStatus, customerName, order) => {
  // Function to format product details
  const formatProductDetails = (products) => {
    return products.map(product => {
      return `${product.name} (${product.quantity} x ${product.price})`;
    }).join(', ');
  };

  // my custom eng to bang
  const translateOrderStatus = (status) => {
    const statusMap = {
      'Received': 'গ্রহণ করা হয়েছে',
      'Confirmed': 'নিশ্চিত করা হয়েছে',
      'Dispatched': 'প্রেরিত করা হয়েছে',
      'Delivered': 'সরবরাহ করা হয়েছে',
      'On-Hold': 'স্থগিত রাখা হয়েছে',
      'Cancelled': 'বাতিল করা হয়েছে',
      'Spammed': 'স্প্যাম হিসাবে চিহ্নিত করা হয়েছে',
    };
    return statusMap[status] || status;
  };

  // Generate SMS message based on order status
  const messages = {
    'Received': `সম্মানিত ${customerName},\nআপনার অর্ডার 
    (${order.orderId}) ${translateOrderStatus(orderStatus)} 
    হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,

    'Confirmed': `সম্মানিত  ${customerName},\nআপনার অর্ডার 
    (${order.orderId}) ${translateOrderStatus(orderStatus)}
     হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,
    'Dispatched': `সম্মানিত ${customerName},\nআপনার অর্ডার 
    (${order.orderId}) ${translateOrderStatus(orderStatus)} 
    হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,
    'Delivered': `সম্মানিত ${customerName},\nআপনার অর্ডার 
    (${order.orderId}) ${translateOrderStatus(orderStatus)}
     হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,


    'On-Hold': `সম্মানিত ${customerName},\nআপনার অর্ডার (${order.orderId}) ${translateOrderStatus(orderStatus)} 
    হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,

    'Cancelled': `সম্মানিত ${customerName},\nআপনার অর্ডার (${order.orderId}) ${translateOrderStatus(orderStatus)} 
    হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,


    'Spammed': `সম্মানিত ${customerName},\nআপনার অর্ডার
     (${order.orderId}) ${translateOrderStatus(orderStatus)}
      হয়েছে এই বিস্তারিতে:\n${formatProductDetails(order.products)}।\nমোট মূল্য: ${order.totalPrice}, অফার মূল্য: ${order.discountAmount}।\nঅর্ডার অবস্থা: ${translateOrderStatus(orderStatus)

    }`,
  };

  return messages[orderStatus] || '';
};

module.exports = {
  getSMSText
};
