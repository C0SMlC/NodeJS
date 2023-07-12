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

  Tour.findByIdAndUpdate({
    ratingsQuantity: stats[0].numRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.reviewedTour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
