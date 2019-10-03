const { param, validationResult, checkSchema } = require('express-validator');

const Offer = require('../models/Offer');
const Publication = require('../models/Publication');
const User = require('../models/User');

const OfferController = {};

OfferController.validate = method => {
  switch (method) {
    case 'createOffer': {
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
        bid: {
          in: ['body'],
          exists: {
            errorMessage: 'Bid field is required'
          },
          isEmpty: {
            errorMessage: 'Bid field cannot be empty',
            negated: true
          },
          trim: true
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
          trim: true
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
        publicationId: {
          in: ['body'],
          exists: {
            errorMessage: 'Publication Id field is required'
          },
          isEmpty: {
            errorMessage: 'Publication Id field cannot be empty',
            negated: true
          },
          custom: {
            options: async value => {
              const publication = await Publication.find({ _id: value });
              if (!publication.length) {
                return Promise.reject(new Error('Publication is not defined'));
              }
            }
          },
          trim: true
        }
      });
    }
    case 'getOffer': {
      return [param('offerId', 'Invalid offerId').isMongoId()];
    }
    case 'updateOffer': {
      return checkSchema({
        offerId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid offerId'
          },
          optional: true
        },
        message: {
          in: ['body'],
          isEmpty: {
            errorMessage: 'Message field cannot be empty',
            negated: true
          },
          optional: true,
          trim: true,
          escape: true,
          stripLow: true
        },
        geolocation: {
          in: ['body'],
          isEmpty: {
            errorMessage: 'Geolocation field cannot be empty',
            negated: true
          },
          optional: true,
          trim: true,
          escape: true,
          stripLow: true
        },
        weight: {
          in: ['body'],
          isEmpty: {
            errorMessage: 'Weight field cannot be empty',
            negated: true
          },
          optional: true,
          trim: true
        },
        bid: {
          in: ['body'],
          isEmpty: {
            errorMessage: 'Bid field cannot be empty',
            negated: true
          },
          optional: true,
          trim: true
        },
        userId: {
          in: ['body'],
          isEmpty: {
            errorMessage: 'User Id field cannot be empty',
            negated: true
          },
          optional: true,
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
        publicationId: {
          in: ['body'],
          exists: {
            errorMessage: 'Publication Id field is required'
          },
          isEmpty: {
            errorMessage: 'Publication Id field cannot be empty',
            negated: true
          },
          optional: true,
          custom: {
            options: async value => {
              const publication = await Publication.find({ _id: value });
              if (!publication.length) {
                return Promise.reject(new Error('Publication is not defined'));
              }
            }
          },
          trim: true
        }
      });
    }
    case 'deleteOffer': {
      return checkSchema({
        offerId: {
          in: ['params'],
          isMongoId: {
            errorMessage: 'Invalid offerId'
          },
          custom: {
            options: async value => {
              const offer = await Offer.find({
                _id: value,
                deletedAt: null
              });
              if (!offer.length) {
                return Promise.reject(new Error('Offer is not defined'));
              }
            }
          }
        }
      });
    }
  }
};

OfferController.createOffer = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { message, geolocation, bid, weight, userId, publicationId } = req.body;

  Offer.create({
    message,
    geolocation,
    bid,
    weight,
    userId,
    publicationId
  })
    .then(offer => res.status(200).send({ offer }))
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem creating the Offer.'
      })
    );
};

OfferController.listOffers = (req, res) => {
  const { message, type, geolocation } = req.query;

  const filter = {
    deletedAt: null
  };

  if (message) {
    filter['message'] = message;
  }

  if (geolocation) {
    filter['geolocation'] = type;
  }

  Offer.find(filter)
    .then(offers => res.status(200).send({ offers }))
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the offers.'
      })
    );
};

OfferController.getOffer = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { offerId } = req.params;

  Offer.findById(offerId)
    .then(offer => {
      if (!offer) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'offerId',
            value: offerId,
            msg: 'Offer not found'
          }
        });
      }
      return res.status(200).send({ offer });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the Offer.'
      })
    );
};

OfferController.updateOffer = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { offerId } = req.params;
  const toUpdate = req.body;

  Offer.findOneAndUpdate({ _id: offerId }, toUpdate, {
    new: true,
    useFindAndModify: false
  })
    .then(offer => {
      if (!offer) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'offerId',
            value: offerId,
            msg: 'Offer not found'
          }
        });
      }

      return res.status(200).send({ offer });
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the offers.'
      })
    );
};

OfferController.deleteOffer = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { offerId } = req.params;

  Offer.findOneAndUpdate(
    { _id: offerId },
    { deletedAt: new Date() },
    {
      new: true,
      useFindAndModify: false
    }
  )
    .then(offer => {
      if (!offer) {
        return res.status(404).send({
          errors: {
            location: 'params',
            param: 'offerId',
            value: offerId,
            msg: 'Offer not found'
          }
        });
      }

      return res.status(200).send(true);
    })
    .catch(err =>
      res.status(500).send({
        errors: err,
        message: 'There was a problem finding the offers.'
      })
    );
};

module.exports = OfferController;
