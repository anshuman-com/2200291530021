const express = require('express');
const correlationController = require('../controllers/correlationController');

const router = express.Router();

// GET /stockcorrelation?minutes=m&ticker={NVDA}&ticker={PYPL}
router.get('/', correlationController.getStockCorrelation);

module.exports = router;