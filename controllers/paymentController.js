const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Dish = require('./../models/dishModel');
const factory = require('./controllerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');


exports.checkout = catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const calculateOrderAmount = (items) => {
        let total = 0;
        items.map(el => {
            total = total + el.price
        })
        return total;
    };

    if (!Array.isArray(req.body.ids)) {
        req.body.ids = [req.body.ids];
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(await Dish.find({ '_id': { $in: Object.values(req.body.ids) } })) * 100,
        currency: "usd",
        // customer: req.body.customer,
        receipt_email: `${req.body.receipt_email}`,
        description: `Comedor Buen Amanecer pago anombre de ${req.body.customer} / ${req.body.receipt_email} por ${req.body.description}`,
        payment_method_types: [
            "card",
        ],
    });
    // console.log(paymentIntent);
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
})