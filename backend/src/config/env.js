const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  churnThreshold: parseFloat(process.env.CHURN_THRESHOLD) || 0.4,
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
