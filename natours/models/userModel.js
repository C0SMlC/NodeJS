const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your name'],
    unique: true,
    lowercase: true,
    validate: [validator.email, 'Please enter your email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter your name'],
    minLength: 8,
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your name'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
