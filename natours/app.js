const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Logging request details to console
app.use(morgan('dev'));

// body parser
app.use(express.json());

// Mounting
// In the context of Express.js, "mounting" refers to attaching a router or middleware to a specific path or URL within the application
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// server

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
