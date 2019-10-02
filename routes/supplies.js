const express = require('express');
const supplyController = require('../controllers/SupplyController');

const router = express.Router();

/* Creates a new supply. */
router.post(
  '/',
  supplyController.validate('createSupply'),
  supplyController.createSupply
);

/* GET supplies listing. */
router.get('/', supplyController.listSupplies);

/* GET a supply. */
router.get(
  '/:supplyId',
  supplyController.validate('getSupply'),
  supplyController.getSupply
);

/* Update a supply. */
router.put(
  '/:supplyId',
  supplyController.validate('updateSupply'),
  supplyController.updateSupply
);

/* Update a supply. */
router.delete(
  '/:supplyId',
  supplyController.validate('deleteSupply'),
  supplyController.deleteSupply
);

module.exports = router;
