const AppError = require('../utils/appError');

const REQUIRED_FIELDS = [
  'gender',
  'SeniorCitizen',
  'Partner',
  'Dependents',
  'tenure',
  'PhoneService',
  'MultipleLines',
  'InternetService',
  'OnlineSecurity',
  'OnlineBackup',
  'DeviceProtection',
  'TechSupport',
  'StreamingTV',
  'StreamingMovies',
  'Contract',
  'PaperlessBilling',
  'PaymentMethod',
  'MonthlyCharges',
  'TotalCharges',
];

const validateCustomerPayload = (req, res, next) => {
  const data = req.body.customerData || req.body;
  if (!data || typeof data !== 'object') {
    return next(new AppError('Customer data payload is required', 400));
  }

  const missing = REQUIRED_FIELDS.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === ''
  );

  if (missing.length > 0) {
    return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
  }

  // Type checks and sanitation
  data.tenure = Number(data.tenure);
  data.MonthlyCharges = Number(data.MonthlyCharges);
  data.TotalCharges = Number(data.TotalCharges);

  if (isNaN(data.tenure) || data.tenure < 0) {
    return next(new AppError('Tenure must be a non-negative number', 400));
  }
  if (isNaN(data.MonthlyCharges) || data.MonthlyCharges < 0) {
    return next(new AppError('MonthlyCharges must be a non-negative number', 400));
  }
  if (isNaN(data.TotalCharges) || data.TotalCharges < 0) {
    return next(new AppError('TotalCharges must be a non-negative number', 400));
  }

  next();
};

module.exports = { validateCustomerPayload, REQUIRED_FIELDS };
