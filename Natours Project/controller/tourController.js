const Tour = require('../modals/tourModel');
const APIFeatures = require('../utils/APIFeatures');

// exports.CheckId = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     //Here its important to return or the next function in stack willl be exeucted causing a error
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next();
// };

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // const tour = tours.find((tour) => tour.id === parseInt(req.params.id));
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = Tour.find((tour) => tour.id === parseInt(req.params.id));
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // return new updated document
      new: true,
      returnDocument: 'after',
      //runValidator to run the validator that is to check the updated values in the req.body
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  // const tour = tours.find((tour) => tour.id === parseInt(req.params.id));
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  try {
    const removedObject = await Tour.findByIdAndDelete(req.params.id);
    // 204 stztus code indicates no contennt
    res.status(204).json({
      status: 'success',
      data: removedObject,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
