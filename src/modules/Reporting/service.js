const OrderModel = require("../Order/model");
const ProductModel = require("../Products/model");
const CouponModel = require("../Discount/model");
const { BadRequest } = require("../../utility/errors");




  const totalSalesAndNetSalesService = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        return { message: "Start and end dates are required" };
      }
  
      const totalSalesResult = await OrderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
            orderStatus: { $gte: 2, $lte: 4 }, // Considering only completed orders (Order Dispatched to Order On-Hold)
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalPrice" },
            totalDiscount: { $sum: "$discountAmount" }, // Sum of discount amounts
            totalVAT: { $sum: { $multiply: ["$totalPrice", 0.15] } }, // Sum of VAT amounts (assuming VAT rate of 15%)
          },
        },
      ]);
  
      if (totalSalesResult.length === 0) {
        return { message: "No completed orders found within the given period" };
      }
  
      const { totalSales, totalDiscount, totalVAT } = totalSalesResult[0]; // Destructuring assignment
  
      // Calculate net sales by subtracting discount and VAT from total sales
      const netSales = totalSales - totalDiscount - totalVAT;
  
      return {
        netSales: netSales,
        totalSales: totalSales,
      };
    } catch (error) {
      console.error("Error fetching net sales:", error);
      return { message: "Internal server error" };
    }
  };
  

  const totalOrderAndVariationsSoldService = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        return { message: "Start and end dates are required" };
      }
      // Calculate total orders for the month
      const totalOrders = await OrderModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      });
  
      // Calculate total variations sold for the month
      const totalVariationsSold = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $unwind: "$products", // Split products array into separate documents
        },
        {
          $group: {
            _id: "$products._id", // Group by product ID
            totalSold: { $sum: "$products.quantity" }, // Sum the quantity of each product sold
          },
        },
      ]);
  console.log(totalVariationsSold)
      return {
        totalOrders: totalOrders,
        totalVariationsSold: totalVariationsSold.length, // Count of unique product variations sold
      };
    } catch (error) {
      console.error("Error fetching total order and variations sold:", error);
      return { message: "Internal server error" };
    }
  };
  



  


module.exports = {
  
  totalSalesAndNetSalesService,
  totalOrderAndVariationsSoldService

};
