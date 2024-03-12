const express = require('express');
const router = express.Router();


//routes

//middlewares
const authVerifyMiddleware = require('../middlewares/authMiddleware');

//routes
const authRoute = require('../modules/Auth/controller');

//EndPoint

router.use('/auth', authRoute);
router.use(authVerifyMiddleware);

module.exports = router;