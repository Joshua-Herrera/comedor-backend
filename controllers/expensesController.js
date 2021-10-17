const Expenses = require('../models/expensesModel');
const factory = require('./controllerFactory');

exports.getAllExpenses = factory.getAll(Expenses);
exports.getOneExpense = factory.getOne(Expenses);
exports.addOneExpense = factory.addOne(Expenses);
exports.updateExpense = factory.updateOne(Expenses);
exports.deleteExpense = factory.deleteOne(Expenses);
