const mongoose = require('mongoose');

const paramsSchema = new mongoose.Schema({
  paramName: {
    type: String,
    required: [true, 'Ingrese el nombre del parametro'],
  },
  paramValue: {
    type: String,
    required: [true, 'Ingrese el valor del parametro'],
  },
});

const Params = mongoose.model('Params', paramsSchema);

module.exports = Params;
