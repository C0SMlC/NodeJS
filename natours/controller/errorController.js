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
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token! Please login again !!!', 401);

const handleJWTTokenExpError = () =>
  new AppError('token expired! Please login again !!!', 401);

const sendErrorDev = (error, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      status: error.status,
      error,
      message: error.message,
      stack: error.stack,
    });
  }
  return res.status(error.statusCode).render('error', {
    title: 'Uh oh! Something went wrong!',
    message: error.message,
  });
};

const sendErrorProd = (error, req, res) => {
  // Operational errors ones that we trust
  if (req.originalUrl.startsWith('/api')) {
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
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
  }
  return res.status(error.statusCode).render('error', {
    title: 'Uh oh! Something went wrong!',
    message: error.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldDB(err);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTTokenExpError();

    sendErrorProd(err, req, res);
  }
};
