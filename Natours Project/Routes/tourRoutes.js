const express = require('express');
const tourController = require('../controller/tourController');
const tourRouter = express.Router();

tourRouter.param('id', tourController.CheckId);

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.addTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRouter;
