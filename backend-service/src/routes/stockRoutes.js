const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

// GET /stocks (get all stocks)
router.get('/', stockController.getAllStocks);

// GET /stocks/:ticker?minutes=m&aggregation=average
router.get('/:ticker', stockController.getAverageStockPrice);

module.exports = router;