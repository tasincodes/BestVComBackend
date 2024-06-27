const { Queue, Worker } = require('bullmq');
const { SendEmailUtilityForAdmin } = require('./email');
const getRedisClient = require('./redisConfig');

async function initializeQueue() {
  try {
    console.log('Initializing email queue');
    const redisClient = await getRedisClient(); // Wait for the connection to be ready
    console.log('Redis client initialized:', redisClient);

    const emailQueue = new Queue('emailQueue', { connection: redisClient });
    console.log('emailQueue initialized:', emailQueue);

    // Create a Worker to process the jobs
    const emailWorker = new Worker('emailQueue', async job => {
      const { emailReciepent, orderData, emailSettings } = job.data;

      const { emailBody, emailHeader, emailType, emailTemplate, orderDetails } = orderData;

      // Format the product details into a HTML table
      const productsTable = orderDetails.products.map(product => {
        return `
          <tr>
            <td>${product.productName}</td>
            <td>${product.quantity}</td>
            <td>${product.unitPrice}</td>
            <td>${product.totalPrice}</td>
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
            <p>Order ID: ${orderDetails.orderId}</p>
            <p>Order Time: ${orderDetails.orderTime}</p>
            <p>Customer Name: ${orderDetails.firstName} ${orderDetails.lastName}</p>
            <p>Delivery Address: ${orderDetails.deliveryAddress}, ${orderDetails.district}</p>
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
            <p>Total Price: ${orderDetails.totalPrice}</p>
            <p>Discount: ${orderDetails.discountAmount}</p>
            <p>VAT: ${orderDetails.vat}</p>
            <p>Delivery Charge: ${orderDetails.deliveryCharge}</p>
            <p><strong>Final Total Price: ${orderDetails.finalTotalPrice}</strong></p>
          </div>
          <div>${emailTemplate.footerText}</div>
        </div>
      `;

      await SendEmailUtilityForAdmin(emailReciepent.join(','), fullEmailBody, orderDetails.subject, emailType);
    });

    return emailQueue; // Return the initialized emailQueue
  } catch (error) {
    console.error('Failed to initialize email queue:', error);
    throw error;
  }
}

module.exports = initializeQueue;
