const mlService = require('../services/mlService');
const customerService = require('../services/customerService');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const csvParser = require('csv-parser');
const stream = require('stream');

class PredictionController {
  /**
   * POST /api/predictions/single
   * Predict churn for a single customer
   */
  async predictSingle(req, res, next) {
    try {
      const { customerData, threshold, saveToDb = true } = req.body;
      const targetCustomer = customerData || req.body;

      const prediction = await mlService.predictSingle(targetCustomer, threshold);

      let savedRecord = null;
      if (saveToDb) {
        const fullCustomer = {
          ...targetCustomer,
          ...prediction,
          source: 'single_form',
        };
        savedRecord = await customerService.saveCustomer(fullCustomer);
      }

      return ApiResponse.success(
        res,
        {
          prediction,
          customer: savedRecord,
        },
        'Churn prediction calculated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/predictions/batch
   * Predict churn for a batch of customers via JSON or CSV
   */
  async predictBatch(req, res, next) {
    try {
      const { customers, threshold, saveToDb = false } = req.body;

      if (!Array.isArray(customers) || customers.length === 0) {
        return next(new AppError('An array of customer records is required', 400));
      }

      const scoredCustomers = await mlService.predictBatch(customers, threshold);

      let savedRecords = null;
      if (saveToDb) {
        const fullRecords = scoredCustomers.map((c) => ({
          ...c,
          source: 'batch_upload',
        }));
        savedRecords = await customerService.saveBatch(fullRecords);
      }

      const highRiskCount = scoredCustomers.filter((c) => c.churnPrediction).length;
      const avgProbability =
        scoredCustomers.reduce((acc, c) => acc + c.churnProbability, 0) /
        scoredCustomers.length;

      return ApiResponse.success(
        res,
        {
          summary: {
            total: scoredCustomers.length,
            highRiskCount,
            lowRiskCount: scoredCustomers.length - highRiskCount,
            churnRate: Number(((highRiskCount / scoredCustomers.length) * 100).toFixed(1)),
            averageChurnProbability: Number(avgProbability.toFixed(4)),
            thresholdUsed: threshold || 0.4,
          },
          results: scoredCustomers,
          savedCount: savedRecords ? savedRecords.length : 0,
        },
        'Batch predictions completed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/predictions/upload-csv
   * Process uploaded CSV file, run predictions, and return structured output
   */
  async uploadAndPredictCSV(req, res, next) {
    try {
      if (!req.file) {
        return next(new AppError('Please upload a CSV file', 400));
      }

      const threshold = req.body.threshold ? parseFloat(req.body.threshold) : undefined;
      const saveToDb = req.body.saveToDb === 'true' || req.body.saveToDb === true;

      const customers = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      bufferStream
        .pipe(csvParser())
        .on('data', (row) => {
          // Normalize column headers if necessary
          const normalized = {
            customerId: row.customerID || row.customerId || `CSV-${Math.random().toString(36).substring(2, 7)}`,
            gender: row.gender || 'Male',
            SeniorCitizen: row.SeniorCitizen === '1' || row.SeniorCitizen === 1 ? 'Yes' : (row.SeniorCitizen || 'No'),
            Partner: row.Partner || 'No',
            Dependents: row.Dependents || 'No',
            tenure: parseFloat(row.tenure) || 0,
            PhoneService: row.PhoneService || 'Yes',
            MultipleLines: row.MultipleLines || 'No',
            InternetService: row.InternetService || 'DSL',
            OnlineSecurity: row.OnlineSecurity || 'No',
            OnlineBackup: row.OnlineBackup || 'No',
            DeviceProtection: row.DeviceProtection || 'No',
            TechSupport: row.TechSupport || 'No',
            StreamingTV: row.StreamingTV || 'No',
            StreamingMovies: row.StreamingMovies || 'No',
            Contract: row.Contract || 'Month-to-month',
            PaperlessBilling: row.PaperlessBilling || 'Yes',
            PaymentMethod: row.PaymentMethod || 'Electronic check',
            MonthlyCharges: parseFloat(row.MonthlyCharges) || 50.0,
            TotalCharges: parseFloat(row.TotalCharges) || (parseFloat(row.tenure) || 1) * (parseFloat(row.MonthlyCharges) || 50.0),
          };
          customers.push(normalized);
        })
        .on('end', async () => {
          try {
            if (customers.length === 0) {
              return next(new AppError('The uploaded CSV file contains no valid records', 400));
            }

            const scoredCustomers = await mlService.predictBatch(customers, threshold);

            let savedRecords = null;
            if (saveToDb) {
              const fullRecords = scoredCustomers.map((c) => ({
                ...c,
                source: 'batch_upload',
              }));
              savedRecords = await customerService.saveBatch(fullRecords);
            }

            const highRiskCount = scoredCustomers.filter((c) => c.churnPrediction).length;
            const avgProbability =
              scoredCustomers.reduce((acc, c) => acc + c.churnProbability, 0) /
              scoredCustomers.length;

            return ApiResponse.success(
              res,
              {
                summary: {
                  fileName: req.file.originalname,
                  total: scoredCustomers.length,
                  highRiskCount,
                  lowRiskCount: scoredCustomers.length - highRiskCount,
                  churnRate: Number(((highRiskCount / scoredCustomers.length) * 100).toFixed(1)),
                  averageChurnProbability: Number(avgProbability.toFixed(4)),
                  thresholdUsed: threshold || 0.4,
                },
                results: scoredCustomers,
                savedCount: savedRecords ? savedRecords.length : 0,
              },
              'CSV processed and batch scored successfully'
            );
          } catch (err) {
            next(err);
          }
        })
        .on('error', (err) => next(err));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PredictionController();
