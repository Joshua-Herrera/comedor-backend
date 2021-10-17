const Params = require('../models/paramsModel');
const factory = require('./controllerFactory');

exports.getParams = factory.getAll(Params);
exports.addParam = factory.addOne(Params);
exports.updateParam = factory.updateOne(Params);
