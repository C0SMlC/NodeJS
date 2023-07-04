const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');

// Users
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
exports.updateUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
exports.createUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
exports.deleteUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
