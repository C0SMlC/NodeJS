const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' A tour must have a name'],
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, ' A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.2,
//   price: 297,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));

module.exports = Tour;
