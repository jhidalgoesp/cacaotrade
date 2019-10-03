const express = require('express');
const PublicationController = require('../controllers/PublicationController');

const router = express.Router();

/* Creates a new publication. */
router.post(
  '/',
  PublicationController.validate('createPublication'),
  PublicationController.createPublication
);

/* GET publications listing. */
router.get('/', PublicationController.listPublications);

/* GET a publication. */
router.get(
  '/:publicationId',
  PublicationController.validate('getPublication'),
  PublicationController.getPublication
);

/* Update a publication. */
router.put(
  '/:publicationId',
  PublicationController.validate('updatePublication'),
  PublicationController.updatePublication
);

/* Update a publication. */
router.delete(
  '/:publicationId',
  PublicationController.validate('deletePublication'),
  PublicationController.deletePublication
);

module.exports = router;
