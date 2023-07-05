const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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
    validate: [validator.isEmail, 'Please enter your email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter your name'],
    minLength: 8,
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your name'],
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'password does not match',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  savedPassword
) {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 100,
      2
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
