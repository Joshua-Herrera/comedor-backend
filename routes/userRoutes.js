const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.patch('/:id', authController.protect, userController.updateUser);
router.get('/getBalance/:id', userController.getbalance);

module.exports = router;
