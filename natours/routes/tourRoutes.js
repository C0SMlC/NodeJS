const express = require('express');

const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoutes');
// const reviewController = require('../controller/reviewController');

// This line of code creates a new instance of an Express router by calling the express.Router() method.
//The router is essentially a mini Express application that can be used to handle routes and middleware.

const router = express.Router();

// A special kind of middleware that runs only if a specified parameter s present in the url
// router.param('id', tourController.checkId);

// router.use(checkBody);

router.use('/:tourId/reviews', reviewRouter);

router.route('/stats').get(tourController.getStats);

router
  .route('/top-five-tours')
  .get(tourController.updateQuery, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    tourController.updateTourPhoto,
    tourController.resizeImage,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/monthly-stats/:year')
  .get(
    authController.protect,
    authController.restrict('admin', 'lead-guide', 'user'),
    tourController.getMonthlyStats
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

module.exports = router;
