const express = require('express');
const router = express.Router();


//routes

//middlewares
const authVerifyMiddleware = require('../middlewares/authMiddleware');

//routes
const authRoute = require('../modules/Auth/controller');
const outletRoute = require('../modules/Outlet/controller');
//EndPoint

router.use('/auth', authRoute);
router.use('/outlet',outletRoute);
router.use(authVerifyMiddleware);

module.exports = router;