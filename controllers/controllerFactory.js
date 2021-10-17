const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const { query } = require('express');

//Get the all records
exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res) => {
    // console.log(req.query)
    let filter = {};
    if (req.params.parentId) filter = { dish: req.params.parentId };

    //Executing query
    const features = new APIFeatures(Model.find(filter), req.query, Model)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    if (popOptions) features.query = features.query.populate(popOptions);
    const records = await features.query;

    //Count total of records for pagination
    const total = await Model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    //If there is no records then return 1
    let totalRecords = total.length > 0 ? total[0].total : 1
    // console.log(totalRecords)

    res.status(200).json({
      status: 'success',
      totalRecords,
      records,
    });
  });

//Get one element
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    // console.log(popOptions);
    const record = await query;
    res.status(200).json({
      status: 'success',
      record,
    });
  });

//Add a new element to the menu
exports.addOne = (Model) =>
  catchAsync(async (req, res) => {
    // console.log(req.body);
    let today = new Date();
    req.body.createdAt = today
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');
    req.body.dayTime = `${today.getHours()}:${today.getMinutes()}`;
    const record = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      record,
    });
  });

//Update an element of the menu
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const record = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      record,
    });
  });

//Delete a element
exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    // console.log(req.params);
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
