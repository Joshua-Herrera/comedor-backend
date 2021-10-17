const DetailedBill = require('../models/detailedBillingModel');
const factory = require('./controllerFactory');

exports.getAllBills = factory.getAll(DetailedBill);
exports.addOneBill = factory.addOne(DetailedBill);
