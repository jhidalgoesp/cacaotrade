const { validationResult, checkSchema } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const AuthController = {};

AuthController.validate = method => {
  switch (method) {
    case 'issueToken': {
      return checkSchema({
        email: {
          in: ['body'],
          exists: {
            errorMessage: 'Email field is required'
          },
          isEmpty: {
            errorMessage: 'Email field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        }
      });
    }
  }
};

AuthController.issueToken = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log(password);

  User.findOne({ email })
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        var tokenData = { id: user.id, email: user.email };

        var token = jwt.sign(tokenData, process.env.SECRET, {
          expiresIn: '1h'
        });

        res.send({ token });
      } else {
        res.status(401).send({
          errors: [{ msg: 'Invalid email or password' }]
        });
      }
    })
    .catch(err => {
      res.status(401).send({
        errors: [{ msg: 'Invalid email or password' }]
      });
    });
};

AuthController.validateToken = (req, res, next) => {
  jwt.verify(req.headers['x-access-token'], process.env.SECRET, function(
    err,
    decoded
  ) {
    if (err) {
      res.json({
        value: 'token',
        msg: err.message,
        param: 'x-access-token',
        location: 'header'
      });
    } else {
      req.body.userId = decoded.id;
      next();
    }
  });
};

module.exports = AuthController;
