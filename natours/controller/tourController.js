const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

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
exports.updateQuery = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    // const tours = await Tour.find()
    //   .where(duration)
    //   .equals(2)
    //   .where(price)
    //   .equals(200);
    // Building Query
    // Filtering
    // const queryObj = { ...req.query };
    // const excludedFileds = ['page', 'sort', 'limit', 'fields'];
    // excludedFileds.forEach((el) => delete queryObj[el]);

    // // Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // //  \b tag to select exact words and /g flag for replacing multiple words
    // queryStr = queryStr.replace(
    //   /\b(gte|lte|gt|lt|ne|in)\b/g,
    //   (match) => `$${match}`
    // );

    // let query = Tour.find(JSON.parse(queryStr));

    // Sorting

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // Limiting Fields

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //PAGINATION
    // const skip = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const startIndex = (skip - 1) * limit;

    // query = query.skip(startIndex).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (numTours <= skip) throw new Error('not found');
    // }

    // Awaiting Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

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

exports.getStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4 } } },

      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          totalTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $avg: '$price' },
          maxPrice: { $avg: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: -1,
        },
      },
    ]);
    console.log(stats);
    res.status(200).json({
      // JSEND format
      status: 'success',
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingaverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' }, // based on id stats for each entry in difficulllty
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingaverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const monthlyStat = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      // To add new fields
      {
        $addFields: { month: '$_id' },
      },
      // To hide fields
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numToursStart: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: monthlyStat.length,
      data: {
        monthlyStat,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
