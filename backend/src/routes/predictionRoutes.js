const express = require('express');
const router = express.Router();
const multer = require('multer');
const predictionController = require('../controllers/predictionController');
const { validateCustomerPayload } = require('../middleware/validateRequest');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

router.post('/single', validateCustomerPayload, (req, res, next) =>
  predictionController.predictSingle(req, res, next)
);

router.post('/batch', (req, res, next) =>
  predictionController.predictBatch(req, res, next)
);

router.post('/upload-csv', upload.single('file'), (req, res, next) =>
  predictionController.uploadAndPredictCSV(req, res, next)
);

module.exports = router;
