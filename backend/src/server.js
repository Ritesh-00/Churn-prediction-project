const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] Error: ${err.message}`);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`[Uncaught Exception] Error: ${err.message}`);
  });
};

startServer();
