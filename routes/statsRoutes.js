const express = require('express');
const authController = require('./../controllers/authController');
const DashboardController = require('./../controllers/dashboardController');
const StatsController = require('./../controllers/statsController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getStats
  );

router
  .route('/linechart')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.selledDishesPerDay
  )

router
  .route('/outcome/day')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    StatsController.getStatsDay
  );
router
  .route('/outcome/week')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    StatsController.getStatsWeek
  );
router
  .route('/outcome/month')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    StatsController.getStatsMonth
  );
router
  .route('/outcome/year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    StatsController.getStatsYear
  );


module.exports = router;
