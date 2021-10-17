const express = require('express');
const menuController = require('./../controllers/menuController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const billingRouter = require('./billingRoutes');

const router = express.Router();

router.use('/:parentId/reviews', reviewRouter);
router.use('/:parentId/bills', billingRouter);

router
  .route('/')
  .get(menuController.getMenu)
  .post(
    authController.protect,
    menuController.uploadDishImg,
    menuController.resizeImg,
    menuController.addDish
  );
router.route('/forToday').get(menuController.getForToday);

router
  .route('/:id')
  .get(menuController.getDish)
  .patch(authController.protect, menuController.updateDish)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    menuController.deleteDish
  );

module.exports = router;
