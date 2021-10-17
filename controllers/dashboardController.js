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

exports.getRangedStats = catchAsync(async (req, res) => {
  const firstDate = `${req.query.day}-${req.query.month}-${req.query.year}`;
  const secondDate = `${req.query.day2}-${req.query.month2}-${req.query.year2}`;

  const result = await Bill.aggregate([
    {
      $match: { createdAt: { $gte: firstDate, $lte: secondDate } },
    },
    {
      $project: {
        createdDate: '$createdAt',
        day: '$day',
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
        day: { $first: '$day' },
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

exports.getAllStats = catchAsync(async (req, res) => {
  const result = await Bill.aggregate([
    {
      $project: {
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
        _id: null,
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

exports.getAllStatsDay = catchAsync(async (req, res) => {
  const result = await Bill.aggregate([
    {
      $project: {
        day: '$createdAt',
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
        _id: '$day',
        earnings: { $sum: '$earnings' },
        fiado: { $sum: '$fiado' },
        sold: { $sum: '$pagado' },
        totalFiadoDishes: { $sum: '$platosfiados' },
        totalSoldDishes: { $sum: '$platospagados' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getDailyStats = catchAsync(async (req, res) => {
  const firstDate = `${req.query.day}-${req.query.month}-${req.query.year}`;
  const secondDate = `${req.query.day2}-${req.query.month2}-${req.query.year2}`;

  const result = await Bill.aggregate([
    {
      $match: { createdAt: { $gte: firstDate, $lte: secondDate } },
    },
    {
      $project: {
        dayDate: {
          $dayOfWeek: {
            $dateFromString: {
              dateString: '$createdAt',
              format: '%d-%m-%Y',
            },
          },
        },
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
        _id: '$dayDate',
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

exports.getAllWeeklyStats = catchAsync(async (req, res) => {
  const firstDate = `${req.query.day}-${req.query.month}-${req.query.year}`;
  const secondDate = `${7}-${req.query.month * 1 + 1}-${req.query.year}`;
  const result = await Bill.aggregate([
    {
      $match: { createdAt: { $gte: firstDate, $lte: secondDate } },
    },
    {
      $project: {
        weekDate: {
          $week: {
            $dateFromString: {
              dateString: '$createdAt',
              format: '%d-%m-%Y',
            },
          },
        },
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
        _id: '$weekDate',
        earnings: { $sum: '$earnings' },
        fiado: { $sum: '$fiado' },
        sold: { $sum: '$pagado' },
        totalFiadoDishes: { $sum: '$platosfiados' },
        totalSoldDishes: { $sum: '$platospagados' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getAllMonthStats = catchAsync(async (req, res) => {
  re = new RegExp(`${req.query.year}\$`, 'g');
  const result = await Bill.aggregate([
    {
      $match: { createdAt: { $in: [re] } },
    },
    {
      $project: {
        monthDate: {
          $month: {
            $dateFromString: {
              dateString: '$createdAt',
              format: '%d-%m-%Y',
            },
          },
        },
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
        _id: '$monthDate',
        earnings: { $sum: '$earnings' },
        fiado: { $sum: '$fiado' },
        sold: { $sum: '$pagado' },
        totalFiadoDishes: { $sum: '$platosfiados' },
        totalSoldDishes: { $sum: '$platospagados' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getAllYearsStats = catchAsync(async (req, res) => {
  const result = await Bill.aggregate([
    {
      $project: {
        yearDate: {
          $year: {
            $dateFromString: {
              dateString: '$createdAt',
              format: '%d-%m-%Y',
            },
          },
        },
        datet: '$createdAt',
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
        _id: '$yearDate',
        earnings: { $sum: '$earnings' },
        fiado: { $sum: '$fiado' },
        sold: { $sum: '$pagado' },
        totalFiadoDishes: { $sum: '$platosfiados' },
        totalSoldDishes: { $sum: '$platospagados' },
        datet: { $first: '$datet' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});
