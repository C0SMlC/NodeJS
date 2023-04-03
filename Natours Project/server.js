const mongoose = require('mongoose');

const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({
  path: './config.env',
});

const PORT = 3000;

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    // UnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
    // console.log(con.connections);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// PART:

// const tourSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'A tour must have a name'],
//       unique: true,
//     },

//     rating: {
//       type: Number,
//       default: 4.5,
//     },
//     price: {
//       type: Number,
//       required: [true, 'A tour must have a price'],
//     },
//   },
//   {
//     collection: 'tours', // specify the name of the collection to use
//   }
// );

// const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 5,
//   price: 1000,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// PART:

// Environemt variable, by default development

// console.log(app.get('env'));
// console.log(process.env);

//setting custom environemetn varible
// In command prompt type
