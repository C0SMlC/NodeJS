// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.checkId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Not Found',
//     });
//   }
// };

const Tour = require('./../models/tourModel');

// exports.checkBody = (req, res, next) => {
//   if (req.body.name && req.body.price) {
//     next();
//   } else {
//     res.status(400).json({
//       status: 'Failed',
//       message: 'Bad request',
//     });
//   }
// };

exports.getAllTours = (req, res) => {
  try {
    const tours = Tour.find();
    res.status(200).json({
      // JSEND format
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const testTour = new Tour({});
  // testTour.save()
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      // JSEND format
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getTour = (req, res) => {
  try {
    const tour = Tour.findById(req.params.id);
    res.status(200).json({
      // JSEND format
      status: 'success',
      result: tours.length,
      data: {
        tour: tour,
      },
    });
  } catch {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    message: 'Tour Updated Successfully',
  });
};

exports.deleteTour = (req, res) => {
  // const id = req.params.id * 1;
  // const tour = tours.find((tour) => tour.id === id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
