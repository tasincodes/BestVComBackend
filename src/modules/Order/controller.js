const express = require('express');
const router = express.Router();
const orderService = require('../Order/service');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');





// API endpoint for creating orders


const createOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData); // Get total order value from the service
    res.status(200).json({
        message: "Order created successfully",
        createdOrder: order,
        // totalOrderValue: totalOrderValue // Include total order value in the response
    });
});



//Update OrderHandlerByOderID

const updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    res.status(200).json({
        message: "Order updated successfully",
        updatedOrder
    });
});


const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.status(200).json({
        message: "Order deleted successfully"
    });
});


const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
        message: "Successfully retrieved all orders",
        orders
    });
});





//Update Order Status API

const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
      const { orderId } = req.params;
      console.log("test", orderId);
  
      const { newStatus } = req.body;
      console.log("test", newStatus);
  
      if (!newStatus) {
        return res.status(400).json({ message: 'New status is required' });
      }
  
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      return res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
    } catch (error) {
      console.error('Error updating order status:', error);
      // Handle specific error cases (optional)
      if (error.message === 'Invalid orderId format') {
        return res.status(400).json({ message: 'Invalid order ID format' });
      } else if (error.message === 'Order not found') {
        return res.status(404).json({ message: 'Order not found' });
      } else {
        return res.status(500).json({ message: 'Failed to update order status' });
      }
    }
  });
  
  module.exports = updateOrderStatus;
  








router.get('/orders', getAllOrders);
router.post('/orderCreate', createOrder);
router.put('/:orderId', updateOrder);
router.delete('/:id',deleteOrder);
router.put('/:orderId',updateOrderStatus)

module.exports = router;
