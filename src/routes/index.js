const express = require('express');
const router = express.Router();


//routes

//middlewares
const authVerifyMiddleware = require('../middlewares/authMiddleware');

//routes
const authRoute = require('../modules/Auth/controller');
const userRoute=require('../modules/User/controller');
const outletRoute = require('../modules/Outlet/controller')
const categoryRoute = require('../modules/Category/controller');
<<<<<<< HEAD
const customerRoute = require('../modules/Customer/controller');

=======
const productRoute = require('../modules/Products/controller');
>>>>>>> d6ce4dfb1c3b6f94beb0ae361f134cecc401028b


//EndPoint
router.use('/auth', authRoute);
router.use('/user',userRoute);
router.use('/outlet',outletRoute);
router.use('/category',categoryRoute);
<<<<<<< HEAD
router.use('/customer',customerRoute);
=======
router.use('/product',productRoute);
>>>>>>> d6ce4dfb1c3b6f94beb0ae361f134cecc401028b
router.use(authVerifyMiddleware);

module.exports = router;