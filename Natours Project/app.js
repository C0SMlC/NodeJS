const express = require('express');
const fs = require('fs');

const app = express();

// Midlleware stabds between the request and response IMP:
app.use(express.json());

const PORT = 3000;
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//GET

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//Route: /api/v1/tours/:id
// :id is variable that means it can take any value
// :id is called parameter this parameter is compulsory. to create optional parameter use ?
// for example :id?
// Zthis creates an optional parameter called id

app.get('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((tour) => tour.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//POST

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // status code 201 stnads for 'created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

//Patch

app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((tour) => tour.id === parseInt(req.params.id));
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
