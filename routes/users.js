const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

/* Creates a new user. */
router.post('/');

/* GET users listing. */
router.get('/');

/* GET a user. */
router.get('/:userId');

/* Update a user. */
router.put('/:userId');

module.exports = router;
