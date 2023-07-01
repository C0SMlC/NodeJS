const AppError = require('../utils/AppError');

const handleErrorDB = (err) => {
  const message = `Inavlid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  // Operational errors ones that we trust
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  // Programming Error
  else {
    // 1. log the error
    console.error('Error⚡', error);
    res.status(500).json({
      status: 'Error',
      message: 'Something Went Wrong :(',
    });
  }
};
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  // console.log('Hey');
  // console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV == 'production') {
    let err = { ...error };
    if (err.name === 'CastError') err = handleErrorDB(err);
    sendErrorProd(error, res);
  }
};
