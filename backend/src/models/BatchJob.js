const mongoose = require('mongoose');

const batchJobSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    processedRecords: {
      type: Number,
      default: 0,
    },
    highRiskCount: {
      type: Number,
      default: 0,
    },
    averageChurnProbability: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BatchJob', batchJobSchema);
