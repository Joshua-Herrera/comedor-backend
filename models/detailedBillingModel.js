const mongoose = require('mongoose');

const detailedBillingSchema = new mongoose.Schema({
  bill: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
  },
  dish: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dish',
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  amount: {
    type: Number,
    required: [true, 'El recibo debe contener un plato'],
    validate: {
      // This only works on create and save
      validator: function (el) {
        return el > 0;
      },
      message: 'La cantidad no puede ser 0',
    },
  },
  createdAt: {
    type: String,
  },
  dayTime: {
    type: String,
  },
  day: {
    type: String,
  },
});

detailedBillingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dish',
    select: 'name price image',
  });

  next();
});

const DetailedBill = new mongoose.model('detailedBill', detailedBillingSchema);

module.exports = DetailedBill;
