const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protect, productController.addOneProduct);
router
  .route('/:id')
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    productController.deleteProduct
  );

module.exports = router;
