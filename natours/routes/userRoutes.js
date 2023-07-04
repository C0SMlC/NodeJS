const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/', userController.getUsers);

router.route('/signup').post(authController.signup);

router.route('/login').post(authController.login);

// router
//   .route('/api/v1/users/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
