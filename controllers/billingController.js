const Bill = require('../models/billingModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./controllerFactory');

exports.getAllBills = factory.getAll(Bill);

exports.getOrders = catchAsync(async (req, res) => {
  // console.log(req.body)
  //Count total of records for pagination
  const totalRecords = await Bill.aggregate([
    {
      $match: { status: req.query.ifValue },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]);

  const filter = { status: req.query.ifValue };

  const records = await Bill.find().where(req.query.status).equals(req.query.ifValue).populate({ path: 'dishes' })
  // console.log(filter)

  res.status(200).json({
    status: 'success',
    totalRecords,
    records
  });
});

//This is for getting all the orders for an specific user
exports.getOwnedOrders = catchAsync(async (req, res) => {
  let filter = {};
  // console.log(req.body)
  //Count total of records for pagination
  const totalRecords = await Bill.aggregate([
    {
      $match: { status: req.query.ifValue },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
  ]);

  const records = await Bill.find({ user: req.body.id }).where(req.body.status).equals(req.body.ifValue).populate({ path: 'dishes' })

  // console.log(records)

  res.status(200).json({
    status: 'success',
    totalRecords,
    records
  });
});

exports.getOneBill = factory.getOne(Bill);
exports.setParentIDs = (req, res, next) => {
  //Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
exports.addOneBill = factory.addOne(Bill);
exports.updateBill = factory.updateOne(Bill);
exports.deleteBill = factory.deleteOne(Bill);
