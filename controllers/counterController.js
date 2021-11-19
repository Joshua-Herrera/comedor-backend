const Counter = require('../models/counterModel');
const factory = require('./controllerFactory');

exports.getCounts = factory.getAll(Counter);
exports.setCount = factory.addOne(Counter);
exports.getCount = factory.getOne(Counter);
exports.updateCount = factory.updateOne(Counter);