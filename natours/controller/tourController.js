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

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // Building Query
    // Filtering
    const queryObj = { ...req.query };
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];
    excludedFileds.forEach((el) => delete queryObj[el]);

    // Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    //  \b tag to select exact words and /g flag for replacing multiple words
    queryStr = queryStr.replace(
      /\b(gte|lte|gt|lt|ne|in)\b/g,
      (match) => `$${match}`
    );

    const query = Tour.find(JSON.parse(queryStr));

    // const tours = await Tour.find()
    //   .where(duration)
    //   .equals(2)
    //   .where(price)
    //   .equals(200);

    // Awaiting Query
    const tours = await query;

    res.status(200).json({
      // JSEND format
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    console.log(err);
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

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      // JSEND format
      status: 'success',
      // result: tours.length,
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // To return new updqated document
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      // JSEND format
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};
