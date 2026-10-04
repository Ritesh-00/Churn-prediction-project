const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      trim: true,
      default: () => 'CUST-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    },
    // Demographics
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    SeniorCitizen: {
      type: mongoose.Schema.Types.Mixed, // Can be 0/1 or "Yes"/"No"
      required: true,
    },
    Partner: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    Dependents: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },

    // Account & Subscription Info
    tenure: {
      type: Number,
      required: true,
      min: 0,
    },
    PhoneService: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    MultipleLines: {
      type: String,
      enum: ['Yes', 'No', 'No phone service'],
      required: true,
    },
    InternetService: {
      type: String,
      enum: ['DSL', 'Fiber optic', 'No'],
      required: true,
    },
    OnlineSecurity: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },
    OnlineBackup: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },
    DeviceProtection: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },
    TechSupport: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },
    StreamingTV: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },
    StreamingMovies: {
      type: String,
      enum: ['Yes', 'No', 'No internet service'],
      required: true,
    },

    // Contract & Financials
    Contract: {
      type: String,
      enum: ['Month-to-month', 'One year', 'Two year'],
      required: true,
    },
    PaperlessBilling: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    PaymentMethod: {
      type: String,
      enum: [
        'Electronic check',
        'Mailed check',
        'Bank transfer (automatic)',
        'Credit card (automatic)',
      ],
      required: true,
    },
    MonthlyCharges: {
      type: Number,
      required: true,
      min: 0,
    },
    TotalCharges: {
      type: Number,
      required: true,
      min: 0,
    },

    // ML Predictions
    churnProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    churnPrediction: {
      type: Boolean,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    thresholdUsed: {
      type: Number,
      default: 0.4,
    },
    recommendations: [
      {
        type: String,
      },
    ],
    source: {
      type: String,
      enum: ['single_form', 'batch_upload', 'api'],
      default: 'single_form',
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ customerId: 1 });
customerSchema.index({ churnPrediction: 1 });
customerSchema.index({ riskLevel: 1 });
customerSchema.index({ churnProbability: -1 });

module.exports = mongoose.model('Customer', customerSchema);
