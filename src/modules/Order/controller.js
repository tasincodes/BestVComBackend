const express = require('express');
const router = express.Router();
const orderService = require('../Order/service');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');





// API endpoint for creating orders

const createOrder = asyncHandler(async (req, res) => {
    const orderData = req.body;
    const createdOrder = await orderService.createOrder(orderData);
    res.status(200).json({
        message: "Order created successfully",
        createdOrder
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




router.post('/orderCreate', createOrder);
router.put('/:orderId', updateOrder);
router.delete('/:id',deleteOrder);

module.exports = router;
