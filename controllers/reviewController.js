const Review = require('./../models/reviewModel');
const factory = require('./controllerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.setParentIDs = (req, res, next) => {
  //Allow nested routes
  if (!req.body.dish) req.body.dish = req.params.parentId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.addOneReview = factory.addOne(Review);
exports.updateOneReview = factory.updateOne(Review);
exports.deleteOneReview = factory.deleteOne(Review);
