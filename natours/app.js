const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const errorController = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
// To tell express which template engine to use
app.set('view engine', 'pug');
// path join will automatically join to the views from the views folder
app.set('views', path.join(__dirname, 'views'));
// Serving static files, to view static files such as images on server
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

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

// Data sanitisation against NOSQL query injection
// {
//     "email":{"$gt":""},
//     "password":"aaaaaaaaaaaa"
// }
app.use(mongoSanitize());

// Data sanitize gainst xss i.e malicious html code included with js
// Cross-Site Scripting
app.use(xss());

// Prevent parameter pollution (HTTP Parameter Pollution)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    capacity: 5,
  });
});

// Mounting
// In the context of Express.js, "mounting" refers to attaching a router or middleware to a specific path or URL within the application
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
