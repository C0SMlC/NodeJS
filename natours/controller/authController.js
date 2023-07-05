const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // create a new token
  const token = signToken(newUser._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if email and password is entered
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }

  // 2. check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // user = await user.select('-__v');

  console.log(`${user}`);
  console.log(password);
  console.log(`${await user.correctPassword(password, user.password)}`);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    result: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }
  // 2. Verifying token

  // promisify(jwt.verify) is a higher-order function that converts jwt.
  // verify into a Promise-based function. It takes jwt.verify as an argument
  // and returns a new function that returns a Promise instead of using a callback.
  // By immediately invoking promisify(jwt.verify) with (token, process.env.JWT_SECRET_KEY)
  // the resulting function is called with two arguments: token and process.env.JWT_SECRET_KEY.

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  console.log(decoded);

  // 3. Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to that token no longer exists', 401)
    );
  }

  //  4. Check if user changed password after the token was issued

  next();
});
