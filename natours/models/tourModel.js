const slugify = require('slugify');
// const validator = require('validator');
const mongoose = require('mongoose');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
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
      required: [true, ' A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be less than 5'],
      // runs each time the filed is set
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, ' A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.price >= value;
        },
        message: 'Discount of {VALUE} is not valid for this tour',
      },
    },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//virtual properties
// wont be saved ib DB, but wll be calculates right on spot
// cant query
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'reviewedTour',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE
// runs before save() and create() not before update
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Modeling Tour Guides - Embedding
// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

// runs after save() and create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
// /^find/ => regular expression used to target findOne() and find both the methods

tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: { $ne: true },
  });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`The query took ${Date.now() - this.start} milliseconds.`);
  next();
});

// Aggregate MIDDLEWARE

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

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
