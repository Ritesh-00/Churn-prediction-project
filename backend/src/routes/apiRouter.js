const express = require('express');
const router = express.Router();

const predictionRoutes = require('./predictionRoutes');
const customerRoutes = require('./customerRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/predictions', predictionRoutes);
router.use('/customers', customerRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);

module.exports = router;
