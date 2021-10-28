const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Dish = require('./../models/dishModel');
const factory = require('./controllerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');


exports.checkout = catchAsync(async (req, res, next) => {

    // const cart = await Dish.find({ '_id': { $in: req.body.ids } })

    // console.log(cart)

    const calculateOrderAmount = (items) => {
        let total = 0;
        items.map(el => {
            total = total + el.price
        })
        return total;
    };

    // console.log(req.body.ids)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(await Dish.find({ '_id': { $in: Object.values(req.body.ids) } })) * 100,
        currency: "usd",
        payment_method_types: [
            "card",
        ],
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
})