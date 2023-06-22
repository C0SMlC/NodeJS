const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

//Logging request details to console
app.use(morgan('dev'));

// body parser
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
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
const tourRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Mounting
// In the context of Express.js, "mounting" refers to attaching a router or middleware to a specific path or URL within the application
app.use('/api/v1/tours', tourRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Users

const getUsers = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};

const getUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const updateUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const createUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const deleteUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};

const userRouter = express.Router();
app.use('/api/v1/users', userRouter);

app.route('/api/v1/users').get(getUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
