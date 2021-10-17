const Bill = require('../models/billingModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./controllerFactory');

exports.getAllBills = factory.getAll(Bill);

exports.getOrders = catchAsync(async (req, res) => {
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

  const filter = {status: req.query.ifValue};

  //Executing query
  // const features = new APIFeatures(
  //   Bill.find(filter),
  //   req.query,
  //   Bill
  // )
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();
  // features.query = features.query.populate({ path: 'dishes' });
  // const records = await features.query;
  
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

  // //Executing query
  // const features = new APIFeatures(
  //   Bill.find({ user: req.body.id })
  //     .where(`${req.body.status}`)
  //     .equals(req.body.ifValue),
  //   req.query,
  //   Bill
  // )
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();
  // features.query = features.query.populate({ path: 'dishes' });

  // const records = await features.query;

  const records = await Bill.find({ user: req.body.id }).where(req.query.status).equals(req.query.ifValue).populate({ path: 'dishes' })

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
