const express = require('express');

const tourController = require('../controller/tourController');

const tourRouter = express.Router();

// tourRouter.param('id', tourController.CheckId);

// const middleware = (req, res, next) => {
//   if (!req.body.name || !req.body.rollno) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'not enough data',
//     });
//   }
//   next();
// };

tourRouter.route('/tour-stats').get(tourController.getTourStats);

tourRouter
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

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
