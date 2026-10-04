const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const apiRouter = require('./routes/apiRouter');
const errorHandler = require('./middleware/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Security Middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

// Logging Middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Root health ping
app.get('/', (req, res) => {
  ApiResponse.success(
    res,
    {
      name: 'Customer Churn Intelligence API',
      version: '1.0.0',
      status: 'operational',
      mlServiceUrl: config.mlServiceUrl,
    },
    'Welcome to the Customer Churn Prediction & Analytics API'
  );
});

// 404 Route handler
app.use((req, res, next) => {
  ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
