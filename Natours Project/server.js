const mongoose = require('mongoose');

const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({
  path: './config.env',
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Environemt variable, by default development

// console.log(app.get('env'));
// console.log(process.env);

//setting custom environemetn varible
// In command prompt type
