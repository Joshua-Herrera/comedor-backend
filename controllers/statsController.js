const Bill = require('../models/billingModel');
const Expenses = require('../models/expensesModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getStatsDay = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  let re = new RegExp(
    `\\b${req.query.day}-${req.query.month}-${req.query.year}`,
    'g'
  );
  // console.log(re);
  const expenses = await Expenses.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        expense: { $sum: '$totalPrice' },
        totalQuantity: {$sum: '$quantity' }
      },
    },
    {
      $group: {
        _id: '$createdAt',
        expense: { $sum: '$expense' },
        totalQuantity: { $sum: '$totalQuantity' },
      },
    },
  ]);

  // console.log(expenses)

  const earnings = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        earning: { $sum: '$totalPrice' },
      },
    },
    {
      $group: {
        _id: '$createdAt',
        earning: { $sum: '$earning' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    records: {
      expenses,
      earnings
    },
  });
});

exports.getStatsWeek = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  let re = new RegExp(
    `\\b${req.query.day}-${req.query.month}-${req.query.year}`,
    'g'
  );
  // console.log(re);
  const expenses = await Expenses.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        expense: { $sum: '$totalPrice' },
        totalQuantity: {$sum: '$quantity' }
      },
    },
    {
      $group: {
        _id: '$createdAt',
        expense: { $sum: '$expense' },
        totalQuantity: { $sum: '$totalQuantity' },
      },
    },
  ]);

  const earnings = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        earning: { $sum: '$totalPrice' },
      },
    },
    {
      $group: {
        _id: '$createdAt',
        earning: { $sum: '$earning' },
      },
    },
  ]);

  // console.log(expenses, earnings)

  res.status(200).json({
    status: 'success',
    records: {
      expenses,
      earnings
    },
  });
});

exports.getStatsMonth = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  let re = new RegExp(
    `\\b${req.query.month}-${req.query.year}`,
    'g'
  );
  // console.log(re);
  const expenses = await Expenses.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        expense: { $sum: '$totalPrice' },
        totalQuantity: {$sum: '$quantity' }
      },
    },
    {
      $group: {
        _id: '$createdAt',
        expense: { $sum: '$expense' },
        totalQuantity: { $sum: '$totalQuantity' },
      },
    },
  ]);

  const earnings = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        earning: { $sum: '$totalPrice' },
      },
    },
    {
      $group: {
        _id: '$createdAt',
        earning: { $sum: '$earning' },
      },
    },
  ]);

  // console.log(expenses, earnings)

  res.status(200).json({
    status: 'success',
    records: {
      expenses,
      earnings
    },
  });
});

exports.getStatsYear = catchAsync(async (req, res, next) => {
  // console.log(req.query)
  let re = new RegExp(
    `\\b${req.query.year}`,
    'g'
  );
  // console.log(re);
  const expenses = await Expenses.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        expense: { $sum: '$totalPrice' },
        totalQuantity: {$sum: '$quantity' }
      },
    },
    {
      $group: {
        _id: '$createdAt',
        expense: { $sum: '$expense' },
        totalQuantity: { $sum: '$totalQuantity' },
      },
    },
  ]);

  const earnings = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        createdAt: '$createdAt',
        earning: { $sum: '$totalPrice' },
      },
    },
    {
      $group: {
        _id: '$createdAt',
        earning: { $sum: '$earning' },
      },
    },
  ]);

  // console.log(expenses, earnings)

  res.status(200).json({
    status: 'success',
    records: {
      expenses,
      earnings
    },
  });
});