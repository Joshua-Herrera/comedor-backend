const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El platillo tiene que tener un nombre'],
      unique: [true, 'El platillo ya existe'],
    },
    price: {
      type: Number,
      required: [true, 'El platillo tiene que tener un precio'],
    },
    ingredients: {},
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'stockDishImg.png'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    forToday: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
dishSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'dish',
  localField: '_id',
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
