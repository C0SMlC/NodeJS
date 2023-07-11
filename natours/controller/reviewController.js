const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');

// const AppError = require('../utils/AppError');

exports.setTourUserIds = (req, res, next) => {
  req.body.reviewedTour = req.body.reviewedTour
    ? req.body.reviewedTour
    : req.params.tourId;

  req.body.reviewer = req.body.reviewer ? req.body.reviewer : req.user.id;
  next();
};

exports.getReviews = handlerFactory.getAll(Review);

exports.getReview = handlerFactory.getOne(Review);

exports.createReview = handlerFactory.createOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);
