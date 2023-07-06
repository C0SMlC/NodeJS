const crypto = require('crypto');

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // generating a random 32 bytes number
  const resetToken = crypto.randomBytes(32).toString('hex');

  // enxrypting the token with sha256
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(
    `unencrpted: ${resetToken} \n Ecrpted: ${this.passwordResetToken}`
  );
  // * 1000 Convert seconds to mS
  this.passwordResetExpires = Date.now() * 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
