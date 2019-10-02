const { param, validationResult, checkSchema } = require('express-validator');

const Supply = require('../models/Supply');
const User = require('../models/User');

const SupplyController = {};

SupplyController.validate = method => {
  switch (method) {
    case 'createSupply': {
      return checkSchema({
        message: {
          in: ['body'],
          exists: {
            errorMessage: 'Message field is required'
          },
          isEmpty: {
            errorMessage: 'Message field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        type: {
          in: ['body'],
          exists: {
            errorMessage: 'Type field is required'
          },
          isEmpty: {
            errorMessage: 'Type field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        geolocation: {
          in: ['body'],
          exists: {
            errorMessage: 'Geolocation field is required'
          },
          isEmpty: {
            errorMessage: 'Geolocation field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        weight: {
          in: ['body'],
          exists: {
            errorMessage: 'Weight field is required'
          },
          isEmpty: {
            errorMessage: 'Weight field cannot be empty',
            negated: true
          },
          isDecimal: {
            errorMessage: 'Invalid numeric',
            negated: false
          },
          trim: true,
        },
        price: {
          in: ['body'],
          exists: {
            errorMessage: 'Price field is required'
          },
          isEmpty: {
            errorMessage: 'Price field cannot be empty',
            negated: true
          },
          isDecimal: {
            errorMessage: 'Invalid numeric',
            negated: false
          },
          trim: true,
        },
        userId: {
          in: ['body'],
          exists: {
            errorMessage: 'User Id field is required'
          },
          isEmpty: {
            errorMessage: 'User Id field cannot be empty',
            negated: true
          },
          custom: {
            options: async value => {
              const user = await User.find({ _id: value });
              if (!user.length) {
                return Promise.reject(new Error('User is not defined'));
              }
            }
          },
          trim: true
        },
      });
    }
    case 'getSupply': {
      return [param('supplyId', 'Invalid supplyId').isMongoId()];
    }
    case 'updateSupply': {
      return checkSchema({
        supplyId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid supplyId'
          }
        },
        message: {
          in: ['body'],
          exists: {
            errorMessage: 'Message field is required'
          },
          isEmpty: {
            errorMessage: 'Message field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        type: {
          in: ['body'],
          exists: {
            errorMessage: 'Type field is required'
          },
          isEmpty: {
            errorMessage: 'Type field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        geolocation: {
          in: ['body'],
          exists: {
            errorMessage: 'Geolocation field is required'
          },
          isEmpty: {
            errorMessage: 'Geolocation field cannot be empty',
            negated: true
          },
          trim: true,
          escape: true,
          stripLow: true
        },
        weight: {
          in: ['body'],
          exists: {
            errorMessage: 'Weight field is required'
          },
          isEmpty: {
            errorMessage: 'Weight field cannot be empty',
            negated: true
          },
          isDecimal: {
            errorMessage: 'Invalid numeric',
            negated: false
          },
          trim: true,
        },
        price: {
          in: ['body'],
          exists: {
            errorMessage: 'Price field is required'
          },
          isEmpty: {
            errorMessage: 'Price field cannot be empty',
            negated: true
          },
          isDecimal: {
            errorMessage: 'Invalid numeric',
            negated: false
          },
          trim: true,
        },
        userId: {
          in: ['body'],
          exists: {
            errorMessage: 'User Id field is required'
          },
          isEmpty: {
            errorMessage: 'User Id field cannot be empty',
            negated: true
          },
          custom: {
            options: async value => {
              const user = await User.find({ _id: value });
              if (!user.length) {
                return Promise.reject(new Error('User is not defined'));
              }
            }
          },
          trim: true
        },
      });
    }
    case 'deleteSupply': {
      return checkSchema({
        supplyId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid supplyId'
          },
          custom: {
            options: async value => {
              const supply = await Supply.find({ _id: value, deletedAt: null });
              if (!supply.length) {
                return Promise.reject(new Error('Supply is not defined'));
              }
            }
          },
        },
      });
    }
  }
};

SupplyController.createSupply = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const {
    message,
    type,
    geolocation,
    weight,
    price,
    userId,
    isActive,
  } = req.body;

  Supply.create({
    message,
    type,
    geolocation,
    weight,
    price,
    userId,
    isActive,
  })
    .then(supply =>
      res.status(200).send({
        message,
        type,
        geolocation,
        weight,
        price,
        userId,
        isActive,
      })
    )
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem creating the supply.'
      })
    );
};

SupplyController.listSupplies = (req, res) => {
  const { message, type, isActive } = req.query;

  const filter = {
    deletedAt: null
  };

  if (message) {
    filter['message'] = message;
  }

  if (type) {
    filter['type'] = type;
  }

  if (isActive) {
    filter['isActive'] = isActive;
  }

  Supply.find(filter)
    .then(supplies => res.status(200).send({ supplies }))
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the supplies.'
      })
    );
};

SupplyController.getSupply = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { supplyId } = req.params;

  Supply.findById(supplyId)
    .then(supply => {
      if (!supply) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'supplyId',
            value: supplyId,
            msg: 'Supply not found'
          }
        });
      }
      return res.status(200).send({ supply });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the Supply.'
      })
    );
};

SupplyController.updateSupply = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { supplyId } = req.params;
  const toUpdate = req.body;

  Supply.findOneAndUpdate({ _id: supplyId }, toUpdate, {
    new: true,
    useFindAndModify: false
  })
    .then(supply => {
      if (!supply) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'supplyId',
            value: supplyId,
            msg: 'Supply not found'
          }
        });
      }

      return res.status(200).send({ supply });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the supplies.'
      })
    );
};

SupplyController.deleteSupply = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { supplyId } = req.params;

  Supply.findOneAndUpdate({ _id: supplyId }, { deletedAt: new Date }, {
    new: true,
    useFindAndModify: false
  })
    .then(supply => {
      if (!supply) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'supplyId',
            value: supplyId,
            msg: 'Supply not found'
          }
        });
      }

      return res.status(200).send(true);
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the supplies.'
      })
    );
};

module.exports = SupplyController;
