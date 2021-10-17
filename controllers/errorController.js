const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = (err) => {
  const message = `Your session has expired, login again`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Will send the error of the operation the client is doing
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Log error to hosting server
    console.error('ERROR', err);
    //Send generic message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  //Get and set the status code and status from where the error was generated
  //If error cannot be specify then it will be 500 - internal server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'dev') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'prod') {
    let error = { ...err };
    error.message = err.message;
    // console.log(error);
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error._message !== undefined) {
      if (error._message.split(' ')[1] === 'validation')
        error = handleValidationErrorDB(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);

    sendErrorProd(error, res);
  }
};
