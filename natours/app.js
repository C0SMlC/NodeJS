const express = require('express');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  //Logging request details to console
  app.use(morgan('dev'));
}

// body parser
app.use(express.json());

// Serving static files, to view static files such as images on server
app.use(express.static(`${__dirname}/public`));

// Mounting
// In the context of Express.js, "mounting" refers to attaching a router or middleware to a specific path or URL within the application
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid Route',
  });
});

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// server

module.exports = app;
