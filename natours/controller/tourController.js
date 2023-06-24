const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Not Found',
    });
  }
};

exports.checkBody = (req, res, next) => {
  if (req.body.name && req.body.price) {
    next();
  } else {
    res.status(400).json({
      status: 'Failed',
      message: 'Bad request',
    });
  }
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    // JSEND format
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newid = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newid };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours)
    // (err) => {
    //   console.log(err);
    // }
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

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((entry) => entry.id === id);

  res.status(200).json({
    // JSEND format
    status: 'success',
    data: {
      tour,
    },
  });
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
