const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/AppError');

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.reviewedTour = req.body.reviewedTour
    ? req.body.reviewedTour
    : req.params.tourId;

  req.body.reviewer = req.body.reviewer ? req.body.reviewer : req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    review,
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  let tour = {};
  if (req.params.id) tour = { id: req.params.id };
  const review = await Review.find(tour);
  res.status(200).json({
    status: 'success',
    review,
  });
});
