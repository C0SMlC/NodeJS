const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/AppError');

// const AppError = require('../utils/AppError');

exports.setTourUserIds = (req, res, next) => {
  req.body.reviewedTour = req.body.reviewedTour
    ? req.body.reviewedTour
    : req.params.tourId;

  req.body.reviewer = req.body.reviewer ? req.body.reviewer : req.user.id;
  next();
};

exports.hasBooked = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const userId = req.user.id;
  const bookedTour = await Booking.find({ tour: tourId, user: userId });
  // console.log(bookedTour);
  if (!bookedTour[0]) {
    return next(new AppError('You have not booked this tour yet', 400));
  }
  next();
});

exports.getReviews = handlerFactory.getAll(Review);

exports.getReview = handlerFactory.getOne(Review);

exports.createReview = handlerFactory.createOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);
