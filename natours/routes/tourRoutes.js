const express = require('express');
const tourController = require('../controller/tourController');

// This line of code creates a new instance of an Express router by calling the express.Router() method. The router is essentially a mini Express application that can be used to handle routes and middleware.
const router = express.Router();

// A special kind of middleware that runs only if a specified parameter s present in the url
// router.param('id', tourController.checkId);

// router.use(checkBody);

router.route('/stats').get(tourController.getStats);

router
  .route('/top-five-tours')
  .get(tourController.updateQuery, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(/*tourController.checkBody,*/ tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
