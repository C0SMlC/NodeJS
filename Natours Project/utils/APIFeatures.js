class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// console.log(req.query);
// const queryObject = { ...req.query };
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((el) => delete queryObject[el]);

// // const allTours = await Tour.find() another way of doing same thing
// //   .where(duration)
// //   .equals(5)
// //   .where('difficulty')
// //   .equals('easy');

// // Advance Filtering

// let querystr = JSON.stringify(queryObject);

// // \b flag is to make sure only exact words are replaced
// querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// let allTours = Tour.find(JSON.parse(querystr));

// if (req.query.sort) {
//   //Now what if there are multiple documents with same pricw
//   // Then there should be another parameter to sort document
//   // And that is easy as mongoose provides an easy solution for this
//   // all we gotta do is  pass another entry separated by space
//   // For Example- IMP: allTours.sort('price anotherFactor');
//   /// Now We can not add space in url so we use comma
//   //and hence
//   // URL 127.0.0.1:3000/api/v1/tours?sort=-price,-ratingaverage
//   const sortBy = req.query.sort.split(',').join(' ');
//   allTours = allTours.sort(sortBy);
// } else {
//   allTours = allTours.sort('-createdAt');
// }

// // FIeld

// if (req.query.fields) {
//   // same as sort
//   const fields = req.query.fields.split(',').join(' ');
//   allTours = allTours.select(fields);
// } else {
//   // - to exclude
//   allTours = allTours.select('-__v');
// }

// // Pagination
// const limit = req.query.limit || 100;
// const page = req.query.page * 1 || 1;
// const skip = (page - 1) * limit;

// if (skip >= Tour.countDocuments()) {
//   throw new Error('This page does not exist');
// }

// allTours = allTours.skip(skip).limit(limit);

// console.log(tours);

module.exports = APIFeatures;
