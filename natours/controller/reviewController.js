const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

// const AppError = require('../utils/AppError');

exports.getReviews = catchAsync(async (req, res, next) => {
  let tour = {};
  if (req.params.tourId) tour = { reviewedTour: req.params.tourId };
  const review = await Review.find(tour);
  res.status(200).json({
    status: 'success',
    count: review.length,
    review,
  });
});

exports.setTourUserIds = (req, res, next) => {
  req.body.reviewedTour = req.body.reviewedTour
    ? req.body.reviewedTour
    : req.params.tourId;

  req.body.reviewer = req.body.reviewer ? req.body.reviewer : req.user.id;
  next();
};

exports.createReview = handlerFactory.createOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);
