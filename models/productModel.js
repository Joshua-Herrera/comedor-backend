const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del ingrediente'],
  },
  //expires field will contain the ranges of time that the ingredient expires at, avoiding to use dates string, because the user will be buying products daily or weekly, and it will be a chore to enter all expiretion dates, instead, knowing that an ingrediente last only one day or week or month makes it easy to be awere, and the app will hint to the user with the addedAtDate field.
  expires: {
    type: String,
    enum: ['year', 'month', 'week', 'day'],
    default: 'week',
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
