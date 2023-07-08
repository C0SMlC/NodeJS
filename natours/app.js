const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/AppError');
const errorController = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Global Middleware

// security http header
app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  //Logging request details to console
  app.use(morgan('dev'));
}

// Too many requests

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again later.',
});

app.use('/api', limiter);

// body parser
app.use(
  express.json({
    limit: '10kb',
  })
);

// Serving static files, to view static files such as images on server
app.use(express.static(`${__dirname}/public`));

// Mounting
// In the context of Express.js, "mounting" refers to attaching a router or middleware to a specific path or URL within the application
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: 'Invalid Route',
  // });
  // const error = new Error(`Can not find ${req.originalUrl} on this server`);
  // error.status = 'fail';
  // error.statusCode = 404;
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// server

module.exports = app;
