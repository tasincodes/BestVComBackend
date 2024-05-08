const OrderModel = require("../Order/model");
const ProductModel = require("../Products/model");
const CouponModel = require("../Discount/model");
const { BadRequest } = require("../../utility/errors");

const totalSalesService = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      return { message: "Start and end dates are required" };
    }

    const totalSales = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $toInt: "$totalOrderValue" } },
        },
      },
    ]);

    if (totalSales.length === 0) {
      return { message: "No orders found within the given period" };
    }

    return {
      result: totalSales[0].totalSales,
    };
  } catch (error) {
    console.error("Error fetching total sales:", error);
    return { message: "Internal server error" };
  }
};


const netSalesService = async(startDate, endDate)=>{
    try{
    if (!startDate ||!endDate) {
        return { message: 'Start and end dates are required' };
      }
      const orders = await OrderModel.find({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      let netSales = 0;

      orders.forEach((order) => {
        netSales += parseInt(order.totalOrderValue) - order.discountAmount;
      });
  
      return{ message: 'Successfully retrieved net sales', result: netSales };
    } catch (error) {
      console.error('Error fetching net sales:', error);
      return{ message: 'Internal server error' };
    }
  }





module.exports = {
  totalSalesService,
};
