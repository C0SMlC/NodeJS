const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

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
    passwordChangedAt: req.body.passwordChangedAt,
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
  // console.log(decoded);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to that token no longer exists', 401)
    );
  }

  //  4. Check if user changed password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.')
    );
  }
  req.user = currentUser;
  next();
});

exports.restrict =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted Email
  const user = await User.findOne({
    email: req.body.email,
  });
  console.log(user);
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // 2. Generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
                   \nIf you did not forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for 10 minutes only',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully !',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    return next(
      new AppError(
        'There was an error sending the email! PLease try again later !!!',
        500
      )
    );
  }

  // next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not created, and ther is user set the new password
  if (!user) {
    return next(
      new AppError(
        'The token is Invalid or Expired, Please try again later!!!',
        400
      )
    );
  }
  // 3) update the changedPassword property
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  // 4) log the user in and create JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    result: {
      user,
    },
  });
});
