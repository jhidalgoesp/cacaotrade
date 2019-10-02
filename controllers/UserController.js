const { param, validationResult, checkSchema } = require('express-validator');

const User = require('../models/User');

const UserController = {};

UserController.validate = method => {
  switch (method) {
    case 'createUser': {
      return checkSchema({
        firstName: {
          in: ['body'],
          exists: {
            errorMessage: 'First Name field is required'
          },
          isEmpty: {
            errorMessage: 'First Name field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        lastName: {
          in: ['body'],
          exists: {
            errorMessage: 'Last Name field is required'
          },
          isEmpty: {
            errorMessage: 'Last Name field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        email: {
          in: ['body'],
          exists: {
            errorMessage: 'Email field is required'
          },
          isEmail: {
            errorMessage: 'Invalid Email'
          },
          custom: {
            options: async value => {
              const user = await User.find({ email: value });
              if (user.length) {
                return Promise.reject(new Error('Email already in use'));
              }
            }
          }
        },
        password: {
          isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            options: { min: 7 }
          }
        },
        phone: {
          in: ['body'],
          optional: true
        },
        status: {
          in: ['body'],
          optional: true,
          isIn: {
            options: ['enabled', 'disabled'],
            errorMessage: `Status must be one of the following ['enabled', 'disabled']`
          }
        }
      });
    }
    case 'getUser': {
      return [param('userId', 'Invalid userId').isMongoId()];
    }
    case 'updateUser': {
      return checkSchema({
        userId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid userId'
          }
        },
        firstName: {
          in: ['body'],
          optional: true,
          trim: true,
          escape: true,
          stripLow: true,
          isEmpty: {
            errorMessage: 'Name field cannot be empty',
            negated: true
          }
        },
        lastName: {
          in: ['body'],
          optional: true,
          trim: true,
          escape: true,
          stripLow: true,
          isEmpty: {
            errorMessage: 'Name field cannot be empty',
            negated: true
          }
        },
        email: {
          in: ['body'],
          optional: true,
          isEmail: {
            errorMessage: 'Invalid Email'
          },
          custom: {
            options: async (value, { req }) => {
              console.log(value);
              const user = await User.findOne({ email: value });
              if (user && user.id !== req.params.userId) {
                return Promise.reject(new Error('Email already in use'));
              }
            }
          }
        },
        password: {
          isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            options: { min: 7 }
          },
          optional: true
        },
        phone: {
          in: ['body'],
          optional: true
        },
        status: {
          in: ['body'],
          optional: true,
          isIn: {
            options: ['enabled', 'disabled'],
            errorMessage: `Status must be one of the following ['enabled', 'disabled']`
          }
        }
      });
    }
  }
};

UserController.createUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, phone } = req.body;

  User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    status: 'enabled'
  })
    .then(user =>
      res.status(200).send({
        firstName,
        lastName,
        email,
        phone,
        status: 'enabled'
      })
    )
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem creating the user.'
      })
    );
};

UserController.listUsers = (req, res) => {
  const { email } = req.body;

  const filter = {};

  if (email) {
    filter['email'] = email;
  }

  User.find(filter)
    .select('-password')
    .then(users => res.status(200).send({ users }))
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the users.'
      })
    );
};

UserController.getUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { userId } = req.params;

  User.findById(userId)
    .select('-password')
    .then(user => {
      if (!user) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'userId',
            value: userId,
            msg: 'User not found'
          }
        });
      }
      return res.status(200).send({ user });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the user.'
      })
    );
};

UserController.updateUser = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { userId } = req.params;
  const toUpdate = req.body;

  User.findOneAndUpdate({ _id: userId }, toUpdate, {
    new: true,
    useFindAndModify: false
  })
    .select('-password')
    .then(user => {
      if (!user) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'userId',
            value: userId,
            msg: 'User not found'
          }
        });
      }

      return res.status(200).send({ user });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the users.'
      })
    );
};

module.exports = UserController;
