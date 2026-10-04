const { getDBStatus } = require('../config/db');
const mlService = require('../services/mlService');
const ApiResponse = require('../utils/apiResponse');

class HealthController {
  async getSystemHealth(req, res, next) {
    try {
      const dbStatus = getDBStatus();
      const mlStatus = await mlService.checkHealth();

      const health = {
        server: {
          status: 'healthy',
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
        },
        database: dbStatus,
        mlMicroservice: mlStatus,
      };

      return ApiResponse.success(res, health, 'System health status retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HealthController();
