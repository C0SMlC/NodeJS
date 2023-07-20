const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/login', viewController.getLoginForm);

router.get('/', viewController.getOverview);

router.get(
  '/tour/:slug',
  authController.protect,
  authController.checkIn,
  viewController.getTour
);

module.exports = router;
