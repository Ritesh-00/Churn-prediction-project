const mongoose = require('mongoose');
const dns = require('dns');
const config = require('./env');

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if DNS override is not permitted
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || config.mongoUri;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
  }
};

const getDBStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const state = mongoose.connection.readyState;
  return {
    state: states[state] || 'Unknown',
    isConnected: state === 1,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

module.exports = { connectDB, getDBStatus };
