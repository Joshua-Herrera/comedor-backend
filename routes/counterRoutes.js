const express = require('express');
const counterController = require('../controllers/counterController');

const router = express.Router();

router
    .route('/')
    .get(
        counterController.getCounts
    )
    .post(counterController.setCount);

router
    .route('/:id')
    .get(counterController.getCount)
    .patch(
        counterController.updateCount
    );

module.exports = router;