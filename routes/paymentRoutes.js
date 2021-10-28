const express = require('express');
const paymentController = require('./../controllers/paymentController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/checkout')
    .post(authController.protect, paymentController.checkout)

module.exports = router;
