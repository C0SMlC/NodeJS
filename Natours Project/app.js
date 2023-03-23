const express = require('express');

const app = express();

const morgan = require('morgan');

const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

// Midlleware stands between the request and response
//IMP:
// Converts res into JSON
app.use(express.json());

app.use(morgan('dev'));
//custom Middleware

app.use((req, res, next) => {
  console.log(`${req.method} request received to ${req.url}`);
  next();
});

// Mounting Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//callbacks

// Route: /api/v1/tours/:id
// :id is variable that means it can take any value
// :id is called parameter this parameter is compulsory. to create optional parameter use ?
// for example :id?
// Zthis creates an optional parameter called id

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', addTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
