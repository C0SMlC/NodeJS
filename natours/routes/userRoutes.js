const express = require('express');

// Users
const getUsers = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};

const getUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const updateUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const createUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};
const deleteUser = (req, res) => {
  //internal server error
  res.status(500).json({
    // JSEND format
    status: 'error',
    result: 'This route is not yet defined !!!',
  });
};

const router = express.Router();

router.route('/api/v1/users').get(getUsers).post(createUser);

router
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
