const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' A tour must have a name'],
    unique: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, ' A tour must have a duration'],
  },

  maxGroupSize: {
    type: Number,
    required: [true, ' A tour must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, ' A tour must have a group difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, ' A tour must have a price'],
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, ' A tour must have a Description'],
  },
  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, ' A tour must have a cover image'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },

  startDates: [Date],
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
