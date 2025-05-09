const stockService = require('../services/stockService');
const stockUtils = require('../utils/stockUtils');


const getAverageStockPrice = async (req, res, next) => {
    try {
        const { ticker } = req.params;
        const minutes = parseInt(req.query.minutes) || 60; // Default to 60 minutes
        const aggregation = req.query.aggregation;

        if (aggregation && aggregation !== 'average') {
            return res.status(400).json({ error: 'Unsupported aggregation type' });
        }

        const priceHistory = await stockService.getStockPriceHistory(ticker, minutes);
        const averagePrice = stockUtils.calculateAveragePrice(priceHistory);

        res.json({
            averageStockPrice: averagePrice,
            priceHistory: priceHistory
        });
    } catch (error) {
        next(error);
    }
};


const getAllStocks = async (req, res, next) => {
    try {
        const stocks = await stockService.getStocks();
        res.json({ stocks });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAverageStockPrice,
    getAllStocks
};