const analyticsService = require('../services/analyticsService');
const ApiResponse = require('../utils/apiResponse');

class AnalyticsController {
  async getDashboardOverview(req, res, next) {
    try {
      const metrics = await analyticsService.getDashboardMetrics();
      return ApiResponse.success(res, metrics, 'Analytics metrics loaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async simulateThreshold(req, res, next) {
    try {
      const { threshold } = req.query;
      const result = await analyticsService.simulateThresholdImpact(threshold);
      return ApiResponse.success(res, result, 'Threshold simulation calculated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
