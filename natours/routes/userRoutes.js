const express = require('express');
const multer = require('multer');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const upload = multer({ dest: 'public/img/users' });
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logOut);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
// photo is the name of filed from ehere the file will be uplaoded
router
  .route('/updateMe')
  .patch(upload.single('photo'), userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);
//
// router.use(authController.restrict('admin', 'lead-guide'));

router.route('/').get(userController.getUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
