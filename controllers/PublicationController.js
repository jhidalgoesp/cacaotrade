const { param, validationResult, checkSchema } = require('express-validator');

const Publication = require('../models/Publication');
const User = require('../models/User');

const PublicationController = {};

PublicationController.validate = method => {
  switch (method) {
    case 'createPublication': {
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
    case 'getPublication': {
      return [param('publicationId', 'Invalid publicationId').isMongoId()];
    }
    case 'updatePublication': {
      return checkSchema({
        publicationId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid publicationId'
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
    case 'deletePublication': {
      return checkSchema({
        publicationId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid publicationId'
          },
          custom: {
            options: async value => {
              const publication = await Publication.find({ _id: value, deletedAt: null });
              if (!publication.length) {
                return Promise.reject(new Error('Publication is not defined'));
              }
            }
          },
        },
      });
    }
  }
};

PublicationController.createPublication = (req, res) => {
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

  Publication.create({
    message,
    type,
    geolocation,
    weight,
    price,
    userId,
    isActive,
  })
    .then(publication =>
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
        message: 'There was a problem creating the Publication.'
      })
    );
};

PublicationController.listPublications = (req, res) => {
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

  Publication.find(filter)
    .then(publications => res.status(200).send({ publications }))
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the publications.'
      })
    );
};

PublicationController.getPublication = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { publicationId } = req.params;

  Publication.findById(publicationId)
    .then(publication => {
      if (!publication) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'publicationId',
            value: publicationId,
            msg: 'Publication not found'
          }
        });
      }
      return res.status(200).send({ publication });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the Publication.'
      })
    );
};

PublicationController.updatePublication = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { publicationId } = req.params;
  const toUpdate = req.body;

  Publication.findOneAndUpdate({ _id: publicationId }, toUpdate, {
    new: true,
    useFindAndModify: false
  })
    .then(publication => {
      if (!publication) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'publicationId',
            value: publicationId,
            msg: 'Publication not found'
          }
        });
      }

      return res.status(200).send({ publication });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the publications.'
      })
    );
};

PublicationController.deletePublication = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { publicationId } = req.params;

  Publication.findOneAndUpdate({ _id: publicationId }, { deletedAt: new Date }, {
    new: true,
    useFindAndModify: false
  })
    .then(publication => {
      if (!publication) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'publicationId',
            value: publicationId,
            msg: 'Publication not found'
          }
        });
      }

      return res.status(200).send(true);
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the publications.'
      })
    );
};

module.exports = PublicationController;
