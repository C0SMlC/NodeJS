const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true, // removes whitespace from the beiging and end of the string
      unique: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingaverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current document on NEW document creation
          return val < this.price;
        },
        // The variable value has access to the current value that is entered
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // removes whitespace from the beiging and end of the string
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true, // removes whitespace from the beiging and end of the string
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], // Array of strings

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],
    isSecretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'tours', // specify the name of the collection to use
  }
);

// Virtual pipeline
// fields in schema that are not store din database, instead calculated directly from the info stored in database
// didnt use arrow function, because arrowfunction did not get its own this keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Middleware in Mongoose
// works same as in nodejs, two type pre and post rubs before and after respectively

// 1. Document Middleware
//runs before save() and create() only

// tourSchema.pre('save', function (next) {
//   console.log('Saving Document.......');
//   next();
// });

// // 1. Document Middleware
// // runs after save() and create() only

// tourSchema.post('save', function (next) {
//   console.log('Document Saved');
//   next();
// });

//////////////////////////////////////////////////////

//////////---------Query Middleware--------///////////

//////////////////////////////////////////////////////

tourSchema.pre(/^find/, function (next) {
  this.find({
    isSecretTour: { $ne: true },
  });
  this.time = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`The query took ${Date.now() - this.time}`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//////////////////////////////////////////////////////

//////////---------Aggregation Middleware--------///////////

//////////////////////////////////////////////////////

// customerSchema.pre('aggregate', function () {
//   // Add a $match state to the beginning of each pipeline.
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
// });

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      isSecretTour: {
        $ne: true,
      },
    },
  });
  console.log(this.pipeline());
  // next();
});
