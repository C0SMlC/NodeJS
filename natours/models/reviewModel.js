const mongoose = require('mongoose');
const Tour = require('./tourModel');
// const slugify = require('slugify');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      requied: [true, 'Review can not be empty.'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    reviewedTour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },

    reviewer: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ reviewedTour: 1, reviewer: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'reviewer',
  //   select: '-__v -passwordChangedAt',
  // }).populate({
  //   path: 'reviewedTour',
  // });
  this.populate({
    path: 'reviewer',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({});
//   next();
// });

// static method will be called on the model itself and not on documnet
reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { reviewedTour: tourId } },
    {
      $group: {
        _id: '$reviewedTour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.reviewedTour);
});

// important to do this as this here points to query and not document
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.reviewedTour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
