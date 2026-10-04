const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', (req, res, next) => healthController.getSystemHealth(req, res, next));

module.exports = router;
