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
  .route('/all')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getAllStats
  );
  router
  .route('/allByDay')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getAllStatsDay
  );
router
  .route('/range')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getRangedStats
  );
router
  .route('/day')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getDailyStats
  );
router
  .route('/week')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getAllWeeklyStats
  );
router
  .route('/months')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getAllMonthStats
  );
router
  .route('/years')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'helper'),
    DashboardController.getAllYearsStats
  );

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
