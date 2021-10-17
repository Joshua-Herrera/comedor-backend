const express = require('express');
const expensesController = require('../controllers/expensesController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(expensesController.getAllExpenses)
  .post(expensesController.addOneExpense);
router
  .route('/:id')
  .get(expensesController.getOneExpense)
  .patch(expensesController.updateExpense)
  .delete(expensesController.deleteExpense);

module.exports = router;
