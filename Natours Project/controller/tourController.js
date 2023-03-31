const Tour = require('../modals/tourModel');

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

exports.aliasTopTours = async (req, res,next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // const allTours = await Tour.find() another way of doing same thing
    //   .where(duration)
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // Advance Filtering

    let querystr = JSON.stringify(queryObject);

    // \b flag is to make sure only exact words are replaced
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let allTours = Tour.find(JSON.parse(querystr));

    if (req.query.sort) {
      //Now what if there are multiple documents with same pricw
      // Then there should be another parameter to sort document
      // And that is easy as mongoose provides an easy solution for this
      // all we gotta do is  pass another entry separated by space
      // For Example- IMP: allTours.sort('price anotherFactor');
      /// Now We can not add space in url so we use comma
      //and hence
      // URL 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingaverage
      const sortBy = req.query.sort.split(',').join(' ');
      allTours = allTours.sort(sortBy);
    } else {
      allTours = allTours.sort('-createdAt');
    }

    // FIeld

    if (req.query.fields) {
      // same as sort
      const fields = req.query.fields.split(',').join(' ');
      allTours = allTours.select(fields);
    } else {
      // - to exclude
      allTours = allTours.select('-__v');
    }

    // Pagination
    const limit = req.query.limit || 100;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;

    if (skip >= Tour.countDocuments()) {
      throw new Error('This page does not exist');
    }

    allTours = allTours.skip(skip).limit(limit);

    const tours = await allTours;
    // console.log(tours);
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
    // const tour = tours.find((tour) => tour.id === parseInt(req.params.id));
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
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
