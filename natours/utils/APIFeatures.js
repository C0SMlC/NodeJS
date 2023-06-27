class APIFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];
    excludedFileds.forEach((el) => delete queryObj[el]);

    // Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    //  \b tag to select exact words and /g flag for replacing multiple words
    queryStr = queryStr.replace(
      /\b(gte|lte|gt|lt|ne|in)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const skip = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const startIndex = (skip - 1) * limit;

    this.query.skip(startIndex).limit(limit);
    // if (this.reqQuery.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (numTours <= skip) throw new Error('not found');
    // }
    return this;
  }
}

module.exports = APIFeatures;
