const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
