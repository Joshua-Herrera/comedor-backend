const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    user,
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(
      new AppError(
        'Un campo ha quedado vacio, por favor ingrese correo y contraseña',
        400
      )
    );
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Credenciales incorrectas', 401));
  }
  const token = signToken(user._id);

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Verifying if jwt token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError(
        'Tiene que acceder a su perfil antes de agregar realizar alguna accion',
        401
      )
    );
  }
  //Checking if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('El token no existe', 401));
  }
  if (currentUser.changedPasswordAfter(token.iat)) {
    new AppError(
      'El usuario cambio contraseña recientemente, por favor ingrese nuevamente'
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ['admin, 'helper']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'No tienes los permisos necesarios para realizar esta accion',
          403
        )
      );
    }
    next();
  };
};
