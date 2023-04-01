const mongoose = require('mongoose');

const dotenv = require('dotenv');

const fs = require('fs');

// const app = require('./app');

const Tour = require('../../modals/tourModel');

dotenv.config({
  path: '../../config.env',
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connection successful');
    // console.log(con.connections);
  });

const tours = JSON.parse(fs.readFileSync(`tours-simple.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // delete all documents
    console.log('Data Destroyed');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
