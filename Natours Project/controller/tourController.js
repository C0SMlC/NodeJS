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

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    // Advance Filtering

    let querystr = JSON.stringify(queryObject);

    // \b flag is to make sure only exact words are replaced
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const allTours = Tour.find(JSON.parse(querystr));

    // const allTours = await Tour.find() another way of doing same thing
    //   .where(duration)
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const tours = await allTours;
    console.log(tours);
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
