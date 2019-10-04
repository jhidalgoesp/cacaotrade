const express = require('express');
const {validateToken} = require('../controllers/AuthController');
const PublicationController = require('../controllers/PublicationController');

const router = express.Router();

/* Creates a new publication. */
router.post(
  '/',
  PublicationController.validate('createPublication'),
  PublicationController.createPublication
);

/* GET publications listing. */
router.get('/', validateToken, PublicationController.listPublications);

/* GET a publication. */
router.get(
  '/:publicationId',
  validateToken,
  PublicationController.validate('getPublication'),
  PublicationController.getPublication
);

/* Update a publication. */
router.put(
  '/:publicationId',
  validateToken,
  PublicationController.validate('updatePublication'),
  PublicationController.updatePublication
);

/* Update a publication. */
router.delete(
  '/:publicationId',
  validateToken,
  PublicationController.validate('deletePublication'),
  PublicationController.deletePublication
);

module.exports = router;
