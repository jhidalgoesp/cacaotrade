const express = require('express');
const userController = require('../controllers/UserController');
const { validateToken } = require('../controllers/AuthController');

const router = express.Router();

/* Creates a new user. */
router.post(
  '/',
  userController.validate('createUser'),
  userController.createUser
);

/* GET users listing. */
router.get('/', validateToken, userController.listUsers);

/* GET a user. */
router.get(
  '/:userId',
  validateToken,
  userController.validate('getUser'),
  userController.getUser
);

/* Update a user. */
router.put(
  '/:userId',
  validateToken,
  userController.validate('updateUser'),
  userController.updateUser
);

module.exports = router;
