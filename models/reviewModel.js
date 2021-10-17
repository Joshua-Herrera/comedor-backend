const mongoose = require('mongoose');
const Dish = require('./dishModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    dish: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dish',
      required: [true, 'The review must belong to a dish.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'The review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dish',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (dishId) {
  const stats = await this.aggregate([
    {
      $match: { dish: dishId },
    },
    {
      $group: {
        _id: '$dish',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Dish.findByIdAndUpdate(dishId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Dish.findByIdAndUpdate(dishId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.dish);
});

//To apply to FindbyIdAndUpdate, and FindByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.dish);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
