const express = require('express');
const paramsController = require('./../controllers/paramsController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(paramsController.getParams)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    paramsController.addParam
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    paramsController.updateParam
  );

module.exports = router;
