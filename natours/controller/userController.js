const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');

const filterFields = (obj, ...includedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (includedFileds.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user tries to update password here

  if (req.body.password || req.body.currentPassword) {
    return next(
      new AppError(
        'To update passowrd please head over to /updatePassword route',
        400
      )
    );
  }

  // 2. filtering request body
  const filteredBody = filterFields(req.body, 'name', 'email');

  // 3. update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Users
exports.getUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
