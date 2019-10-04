const express = require('express');
const OfferController = require('../controllers/OfferController');
const {validateToken} = require('../controllers/AuthController');
const router = express.Router();

/* Creates a new offer. */
router.post(
  '/',
  OfferController.validate('createOffer'),
  OfferController.createOffer
);

/* GET offers listing. */
router.get('/', OfferController.listOffers);

/* GET an offer. */
router.get(
  '/:offerId',
  validateToken,
  OfferController.validate('getOffer'),
  OfferController.getOffer
);

/* Update an offer. */
router.put(
  '/:offerId',
  validateToken,
  OfferController.validate('updateOffer'),
  OfferController.updateOffer
);

/* Update an offer. */
router.delete(
  '/:offerId',
  validateToken,
  OfferController.validate('deleteOffer'),
  OfferController.deleteOffer
);

module.exports = router;
