const express = require('express');

const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

// This line of code creates a new instance of an Express router by calling the express.Router() method.
//The router is essentially a mini Express application that can be used to handle routes and middleware.

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrict('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
