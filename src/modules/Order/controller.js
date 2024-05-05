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

router.post('/orderCreate', createOrder);




module.exports = router;
