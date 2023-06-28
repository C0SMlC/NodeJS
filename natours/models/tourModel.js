const slugify = require('slugify');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
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
      select: false,
    },

    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual properties
// wont be saved ib DB, but wll be calculates right on spot
// cant query
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
// runs before save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after save() and create()
tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

//QUERY MIDDLEWARE
// /^find/ => regular expression used to target findOne() and find both the methods
tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: { $ne: true },
  });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The query took ${Date.now() - this.start} milliseconds.`);
  next();
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
