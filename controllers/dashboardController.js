const Bill = require('../models/billingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getStats = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  let re = new RegExp(
    `\\b${req.query.day}-${req.query.month}-${req.query.year}`,
    'g'
  );
  // console.log(mode);

  // if (req.query.day || req.query.month || req.query.year) {
  const result = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdDate: '$createdAt',
        earnings: { $sum: '$totalPrice' },
        fiado: {
          $cond: {
            if: '$isFiado',
            then: { $sum: '$totalPrice' },
            else: { $sum: 0 },
          },
        },
        pagado: {
          $cond: {
            if: '$isFiado',
            then: { $sum: 0 },
            else: { $sum: '$totalPrice' },
          },
        },
        platosfiados: {
          $cond: {
            if: '$isFiado',
            then: { $sum: '$totalDishes' },
            else: { $sum: 0 },
          },
        },
        platospagados: {
          $cond: {
            if: '$isFiado',
            then: { $sum: 0 },
            else: { $sum: '$totalDishes' },
          },
        },
      },
    },
    {
      $group: {
        _id: '$createdDate',
        earnings: { $sum: '$earnings' },
        fiado: { $sum: '$fiado' },
        sold: { $sum: '$pagado' },
        totalFiadoDishes: { $sum: '$platosfiados' },
        totalSoldDishes: { $sum: '$platospagados' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.selledDishesPerDay = catchAsync(async (req, res, next) => {
  const result = await Bill.aggregate([
    {
      $project: {
        createdDate: '$createdAt',
        day: '$day',
        totalDishes: '$totalDishes'
      }
    },
    {
      $group: {
        _id: '$createdDate',
        day: { $first: '$day' },
        total: { $sum: '$totalDishes' },
      },
    },
    {
      $sort: { _id: 1 },
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});
