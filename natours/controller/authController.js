const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  // create a new token
  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);
  // 1. check if email and password is entered
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 401));
  }

  // 2. check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);

  // user = await user.select('-__v');

  // console.log(`${user}`);
  // console.log(password);
  // console.log(`${await user.correctPassword(password, user.password)}`);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. if everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.logOut = async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

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
  // console.log(currentUser);
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
  res.locals.user = currentUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // 1. Getting token and check of it's there
  if (req.cookies.jwt) {
    try {
      // 2. Verifying token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY
      );

      // 3. Check if user still exists
      const currentUser = await User.findById(decoded.id);
      // console.log(currentUser);
      if (!currentUser) {
        return next();
      }

      //  4. Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.checkIn = (req, res, next) => {
  if (res.locals.user) console.log('checking in');
  next();
};

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
  // console.log(user);
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  // 2. Generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. send it to users email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully !',
    });
  } catch (err) {
    // console.log(err);
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

  // console.log(hashedToken);

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
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const currentUser = await User.findById(req.user.id).select('+password');
  // if (!currentUser) {
  //   return next(new AppError('You are not logged in!', 401));
  // }
  // 2) Check if posted current password is right
  if (
    !(await currentUser.correctPassword(
      req.body.currentPassword,
      currentUser.password
    ))
  ) {
    return next(new AppError('You entered a wrong password!'), 401);
  }
  // 3) if so update the user
  currentUser.password = req.body.password;
  currentUser.confirmPassword = req.body.confirmPassword;
  await currentUser.save();

  // 4) Log user in, and send JWT

  createSendToken(currentUser, 200, res);
});
