const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection Successfull'));

console.log(app.get('env'));
// console.log(process.env);

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
