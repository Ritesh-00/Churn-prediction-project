const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', (req, res, next) => customerController.getCustomers(req, res, next));
router.get('/:id', (req, res, next) => customerController.getCustomerById(req, res, next));
router.delete('/:id', (req, res, next) => customerController.deleteCustomer(req, res, next));

module.exports = router;
