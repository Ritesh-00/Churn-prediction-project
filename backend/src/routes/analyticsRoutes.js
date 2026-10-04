const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', (req, res, next) => analyticsController.getDashboardOverview(req, res, next));
router.get('/simulate-threshold', (req, res, next) => analyticsController.simulateThreshold(req, res, next));

module.exports = router;
