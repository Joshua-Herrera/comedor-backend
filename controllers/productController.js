const Product = require('../models/productModel');
const factory = require('./controllerFactory');

exports.getAllProducts = factory.getAll(Product);
exports.getOneProduct = factory.getOne(Product);
exports.addOneProduct = factory.addOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
