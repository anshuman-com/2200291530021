const stockService = require('../services/stockService');
const stockUtils = require('../utils/stockUtils');
const correlationUtils = require('../utils/correlationUtils');


const getStockCorrelation = async (req, res, next) => {
    try {
        const { ticker } = req.query;
        const minutes = parseInt(req.query.minutes) || 60; // Default to 60 minutes

        // Ensured we have exactly 2 tickers
        if (!ticker || !Array.isArray(ticker) || ticker.length !== 2) {
            return res.status(400).json({
                error: 'Exactly two stock tickers are required for correlation'
            });
        }

        const [ticker1, ticker2] = ticker;

        const [history1, history2] = await Promise.all([
            stockService.getStockPriceHistory(ticker1, minutes),
            stockService.getStockPriceHistory(ticker2, minutes)
        ]);

        const avg1 = stockUtils.calculateAveragePrice(history1);
        const avg2 = stockUtils.calculateAveragePrice(history2);

        const prices1 = correlationUtils.extractPriceValues(history1);
        const prices2 = correlationUtils.extractPriceValues(history2);

        const correlation = correlationUtils.calculateCorrelation(prices1, prices2);

        res.json({
            correlation,
            stocks: {
                [ticker1]: {
                    averagePrice: avg1,
                    priceHistory: history1
                },
                [ticker2]: {
                    averagePrice: avg2,
                    priceHistory: history2
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStockCorrelation
};