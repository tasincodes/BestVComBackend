const express = require('express');
const router = express.Router();
const orderService = require('../Order/service');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');





// API endpoint for creating orders

const createOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;
    const { order, totalOrderValue } = await orderService.createOrder(orderData); // Get total order value from the service
    res.status(200).json({
        message: "Order created successfully",
        createdOrder: order,
        totalOrderValue: totalOrderValue // Include total order value in the response
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


const  acceptOrder=asyncHandler(async (req,res)=>{
    const { orderId } = req.params;
    const userId = req.user.id; // Assuming you have user information in request
  
 
    const acceptedOrder = await orderService.acceptOrder(orderId, userId);
    res.status(200).json({
        message:"Order Staus Update Successfully!",
        acceptedOrder
    })
   
})




router.get('/orders', getAllOrders);
router.post('/orderCreate', createOrder);
router.put('/:orderId', updateOrder);
router.delete('/:id',deleteOrder);
router.put('/:orderId/accept',acceptOrder)
module.exports = router;
