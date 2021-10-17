const express = require('express');
const billingController = require('./../controllers/billingController');
const DetailedBillingController = require('./../controllers/detailedBillingController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    billingController.getAllBills
  )
  .post(
    authController.protect,
    // authController.restrictTo('admin', 'helper'),
    billingController.setParentIDs,
    billingController.addOneBill
  );

//Sub routes for pending orders
router
  .route('/orders')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    billingController.getOrders
  );
//Sub routes for pending orders
router
  .route('/ownedOrders')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    billingController.getOwnedOrders
  );

//Sub routes for detailedBilling
router
  .route('/detailedBilling')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DetailedBillingController.getAllBills
  )
  .post(
    // authController.protect,
    // authController.restrictTo('admin', 'helper'),
    DetailedBillingController.addOneBill
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    billingController.getOneBill
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    billingController.updateBill
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'helper', 'user'),
    billingController.deleteBill
  );

module.exports = router;
