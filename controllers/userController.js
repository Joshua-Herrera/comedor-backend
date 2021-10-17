const User = require('../models/userModel');
const factory = require('./controllerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update', 400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = factory.updateOne(User);

//Get one element
exports.getbalance = catchAsync(async (req, res) => {
    
    let query = User.findById(req.params.id).select('balance');

    const record = await query;

    res.status(200).json({
      status: 'success',
      record,
    });
  });