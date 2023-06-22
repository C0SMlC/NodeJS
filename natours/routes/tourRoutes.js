const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);
const getAllTours = (req, res) => {
  res.status(200).json({
    // JSEND format
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

const createTour = (req, res) => {
  const newid = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newid }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log(err);
    }
  );
  res.status(201).json({
    // JSEND format
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Not Found',
    });
  }

  res.status(200).json({
    // JSEND format
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Not Found',
    });
  }
  res.status(200).json({
    status: 'success',
    message: 'Tour Updated Successfully',
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Not Found',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// This line of code creates a new instance of an Express router by calling the express.Router() method. The router is essentially a mini Express application that can be used to handle routes and middleware.
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
