const AppError = require('../utils/AppError');

const handleErrorDB = (err) => {
  const message = `Inavlid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value:${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  console.log('zyyyyyyyyyyyyyyyyyyyyyyyyyyyffffffff');
  return new AppError(message, 400);
};
const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const handleJWTError = () =>
  new AppError('Invalid token! Please login again !!!', 401);

const handleJWTTokenExpError = () =>
  new AppError('token expired! Please login again !!!', 401);

const sendErrorProd = (error, res) => {
  // Operational errors ones that we trust
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }
  // Programming Error
  else {
    // 1. log the error
    console.error('Error⚡');
    res.status(500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // console.log('Hey');
  // console.log(error.name);
  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    console.log(err.message);
    let error = { ...err };
    console.log(err.message);

    if (error.name === 'CastError') error = handleErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldDB(err);
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log(error.name);
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTTokenExpError();

    sendErrorProd(err, res);
  }
};
