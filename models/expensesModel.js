const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Por favor seleccione el producto'],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    //Metric field is for allow the user to say lb, kg, and other metrics for weight
    metric: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Por favor ingrese cuanto le costo el producto'],
    },
    pricePerUnit: {
      type: Number,
    },
    createdAt: {
      type: String,
      // default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Calculating unit price
expensesSchema.pre('save', function () {
  this.pricePerUnit = this.totalPrice / this.quantity;
});

//Virtual populate
expensesSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: ['name', 'expires'],
  });
  next();
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
