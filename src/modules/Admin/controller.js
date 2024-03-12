const express = require('express');
const router = express.Router();

const handleValidation = require('../../middlewares/schemaValidation');

const {
    HEAD_OFFICE,
    BRANCH_ADMIN,
    CUSTOMER

}=require('../../config/constants');


const authService = require('./service');
const { adminValidate } = require('./request');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');
const { asyncHandler } = require('../../utility/common');