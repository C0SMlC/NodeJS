const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');

// const multStroage = multer.diskStorage({
//   // cb stands for callback which need to call
//   destination: function (req, file, cb) {
//     // cb expexts error as the first argument hence no error specified null
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const imageName = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, imageName);
//   },
// });

// produces a buffer
const multStroage = multer.memoryStorage();
const multFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload an image', 400), false);
  }
};

const upload = multer({ storage: multStroage, fileFilter: multFilter });

exports.updateUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
const filterFields = (obj, ...includedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (includedFileds.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. create error if user tries to update password here
  if (req.body.password || req.body.currentPassword) {
    return next(
      new AppError(
        'To update passowrd please head over to /updatePassword route',
        400
      )
    );
  }

  // 2. filtering request body
  const filteredBody = filterFields(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3. update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Users
exports.getUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
