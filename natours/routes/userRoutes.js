const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  // .get(userController.getUsers)
  .post(authController.signup);

// router
//   .route('/api/v1/users/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
