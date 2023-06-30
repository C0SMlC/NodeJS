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
    console.log('Error⚡', error);
    res.status(500).json({
      status: 'Error',
      message: 'Something Went Wrong :(',
    });
  }
};
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};
