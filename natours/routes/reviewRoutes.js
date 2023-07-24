const express = require('express');

const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

// This line of code creates a new instance of an Express router by calling the express.Router() method.
//The router is essentially a mini Express application that can be used to handle routes and middleware.

const router = express.Router({
  mergeParams: true,
});

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.restrict('user'),
    reviewController.hasBooked,
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrict('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrict('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
