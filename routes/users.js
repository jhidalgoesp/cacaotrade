const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

/* Creates a new user. */
router.post('/users', userController.createUser);

/* GET users listing. */
router.get('/users', userController.getUser);

/* GET a user. */
router.get('/users/:userId');

/* Update a user. */
router.put('/users/:userId');

module.exports = router;
